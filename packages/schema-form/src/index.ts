// import $ from "jquery";
// import {
//   ArrayInputSchemaConfig,
//   EnumInputSchemaConfig,
//   FormSchemaConfig,
//   InputSchemaConfig,
//   JQueryComponent,
//   ObjectInputSchemaConfig,
// } from "widget-up-utils";

// // 创建具体的输入元素
// function createInput(inputConfig: InputSchemaConfig): JQuery<HTMLElement> {
//   let inputElement: JQuery<HTMLElement>;
//   switch (inputConfig.type) {
//     case "string":
//     case "number":
//     case "date":
//     case "color":
//     case "file":
//       inputElement = $(`<input type="${inputConfig.type}" />`);
//       break;
//     case "boolean":
//       inputElement = $('<input type="checkbox" />');
//       if (inputConfig.initialValue) {
//         inputElement.prop("checked", inputConfig.initialValue);
//       }
//       break;
//     case "range":
//       inputElement = $(`<input type="range" />`);
//       break;
//     case "enum":
//     case "multiSelect":
//       inputElement = $("<select></select>");
//       if (inputConfig.type === "multiSelect") {
//         inputElement.attr("multiple", "multiple");
//       }
//       (inputConfig as EnumInputSchemaConfig).options.forEach((option) => {
//         inputElement.append($(`<option value="${option}">${option}</option>`));
//       });
//       break;
//     case "array":
//     case "object":
//       // 递归创建表单组件以处理嵌套数据结构
//       inputElement = $("<div></div>");
//       (
//         inputConfig as ArrayInputSchemaConfig | ObjectInputSchemaConfig
//       ).children?.forEach((child) => {
//         inputElement.append(createInput(child));
//       });
//       break;
//     default:
//       inputElement = $("<input />");
//       break;
//   }

//   if (
//     inputConfig.initialValue !== undefined &&
//     inputConfig.type !== "boolean"
//   ) {
//     inputElement.val(inputConfig.initialValue as any);
//   }

//   return inputElement;
// }

// // 定义 SchemaForm 组件
// export const SchemaForm: JQueryComponent<{ formSchema?: FormSchemaConfig }> = ({
//   formSchema,
// }) => {
//   const form = $("<form></form>");
//   formSchema?.inputs?.forEach((inputConfig) => {
//     const label = $("<label></label>").text(inputConfig.label + ": ");
//     const inputElement = createInput(inputConfig);
//     const wrapper = $("<div></div>").append(label).append(inputElement);
//     form.append(wrapper);
//   });
//   return form[0];
// };

// export default SchemaForm;

const hi = "h234i";

export { hi };
