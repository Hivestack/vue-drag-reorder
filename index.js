'use strict';

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var moveTo = function moveTo(list, fromIndex, toIndex) {
  var arr = [];
  toIndex = ~~toIndex;
  fromIndex = ~~fromIndex;
  if (toIndex >= fromIndex) {
    arr = arr.concat(list.slice(0, fromIndex)).concat(list.slice(fromIndex + 1, toIndex + 1)).concat(list.slice(fromIndex, fromIndex + 1)).concat(list.slice(toIndex + 1));
  } else {
    arr = arr.concat(list.slice(0, toIndex)).concat(list.slice(fromIndex, fromIndex + 1)).concat(list.slice(toIndex, fromIndex)).concat(list.slice(fromIndex + 1));
  }
  return arr;
};

var confirmTarget = function confirmTarget(target) {
  while(target.nodeName !== 'TR' && target.nodeName !== 'UL') {
    target = target.parentElement;
  }
  return target;
};

var workWithClass = function workWithClass(element, newClass, defaultClassName, doWhat) {
  if (!element.classList) return;
  var className = defaultClassName;
  if (newClass) className = newClass;
  if (doWhat === 'add') {
    element.classList.add(className);
  } else if (doWhat === 'remove') {
    element.classList.remove(className);
  }
};

exports.install = function (Vue) {
  Vue.directive('dragable', {
    bind: function bind(el, binding, vnode) {
      var self = this;
      var element = el;
      var node = vnode;
      element.draggable = true;
      element.ondragstart = function (event) {
        workWithClass(element, binding.value['dragClass'], 'yita-draging', 'add');
        if(event.target.rowIndex != null) {
          event.dataTransfer.setData('text', event.target.rowIndex - 1);
        } else {
          event.dataTransfer.setData('text', [].slice.call(event.target.parentElement.children).indexOf(event.target));
        }
        console.log(`dragging row ${event.target.rowIndex - 1}`);
      };
      element.ondragend = function (event) {
        workWithClass(element, binding.value['dragClass'], 'yita-draging', 'remove');
      };
      element.ondrag = function (event) {
      };
    },
    update: function update(newValue, oldValue) {
    },
    unbind: function unbind() {
    }
  });
  Vue.directive('droper', {
    bind: function bind(el, binding, vnode) {
      var self = this;
      var list = binding.value.list;
      var element = el;
      var node = vnode;
      var emit = binding.def.emit;
      element.ondragenter = function (event) {
        var target = event.target;
        target = confirmTarget(target);
        // let index = Array.from(this.children).indexOf(target)
        workWithClass(target, vnode.data.attrs['dragClass'], 'yita-draging-zone', 'add');
      };
      element.ondragleave = function (event) {
        var target = event.target;
        target = confirmTarget(target);
        workWithClass(target, vnode.data.attrs['dragClass'], 'yita-draging-zone', 'remove');
      };
      element.ondragover = function (event) {
        event.preventDefault();
      };
      element.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var fromIndex = parseInt(event.dataTransfer.getData('text'), 10);
        var target = event.target;
        target = confirmTarget(target);
        workWithClass(target, vnode.data.attrs['dragClass'], 'yita-draging-zone', 'remove');
        var toIndex = (0, _from2.default)(this.children).indexOf(target);
        if (toIndex !== -1) {
          var out = moveTo(list, fromIndex, toIndex);
          emit(node, 'itemOrderChanged', { fromIndex: fromIndex, toIndex: toIndex });
        }
      };
    },
    update: function update(value, oldValue) {
    },
    unbind: function unbind() {
    },
    emit: function (vnode, name, data) {
      var handlers = (vnode.data && vnode.data.on) ||
        (vnode.componentOptions && vnode.componentOptions.listeners);

      if (handlers && handlers[name]) {
        handlers[name].fns(data);
      }
    }
  });
};

