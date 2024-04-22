import $ from "jquery";
import { JQueryComponent } from "widget-up-lib";


export default class Component implements JQueryComponent {
  start({ rootElement, settings }) {
    // 清空 rootElement 并准备表单
    $(rootElement).empty();

    // 递归渲染表单元素的函数
    const renderInputs = (inputs, parentElement) => {
      inputs.forEach((input) => {
        // 创建表单控件
        const element = createInputControl(input);
        $(parentElement).append(element);

        // 如果有子元素，递归调用
        if (input.children && input.children.length > 0) {
          const container = $('<div class="input-children"></div>');
          $(element).append(container);
          renderInputs(input.children, container);
        }
      });
    };

    // 根据 input 类型创建 HTML 控件
    const createInputControl = (input) => {
      let inputElement;
      switch (
        input.constructor.name // 或根据 input.type 来判断
      ) {
        case "StringInput":
          inputElement = $('<input type="text">')
            .val(input.value)
            .on("input", (e) => input.onChange(e.target.value));
          break;
        case "NumberInput":
          inputElement = $('<input type="number">')
            .val(input.value)
            .on("input", (e) => input.onChange(parseFloat(e.target.value)));
          break;
        case "BooleanInput":
          inputElement = $('<input type="checkbox">')
            .prop("checked", input.value)
            .on("change", (e) => input.onChange(e.target.checked));
          break;
        case "DateInput":
          inputElement = $('<input type="date">')
            .val(input.value.toISOString().substring(0, 10))
            .on("input", (e) => input.onChange(new Date(e.target.value)));
          break;
        case "ArrayInput":
        case "ObjectInput":
          // 简化示例，通常需要更复杂的处理
          inputElement = $("<textarea>")
            .text(JSON.stringify(input.value))
            .on("input", (e) => input.onChange(JSON.parse(e.target.value)));
          break;
        case "EnumInput":
          inputElement = $("<select>");
          input.options.forEach((option) => {
            $(inputElement).append($(`<option>`).val(option).text(option));
          });
          $(inputElement)
            .val(input.value)
            .on("change", (e) => input.onChange(e.target.value));
          break;
        // 其他类型
      }
      return $('<div class="form-group">').append(inputElement);
    };

    // 开始渲染表单
    const formElement = $("<form>").on("submit", (e) => e.preventDefault());
    $(rootElement).append(formElement);
    renderInputs(schemas.inputs, formElement);
  }

  update({settings}) {

  }
};
