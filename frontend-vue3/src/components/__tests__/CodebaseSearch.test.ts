import { mount } from "@vue/test-utils";
import CodebaseSearch from "@/components/CodebaseSearch.vue";
import BaseSearch from "@/components/BaseSearch.vue";
import FormTextInput from "@/components/form/FormTextInput.vue";
import FormDatePicker from "@/components/form/FormDatePicker.vue";
import FormTagger from "@/components/form/FormTagger.vue";
import FormSelect from "@/components/form/FormSelect.vue";

describe("CodebaseSearch.vue", () => {
  it("renders the form field components", async () => {
    const wrapper = mount(CodebaseSearch);

    const baseSearch = wrapper.findComponent(BaseSearch);
    expect(baseSearch.exists()).toBe(true);

    const formTextInput = wrapper.findComponent(FormTextInput);
    expect(formTextInput.exists()).toBe(true);

    const anyDatePicker = wrapper.findComponent(FormDatePicker);
    expect(anyDatePicker.exists()).toBe(true);

    const formTagger = wrapper.findComponent(FormTagger);
    expect(formTagger.exists()).toBe(true);

    const formSelect = wrapper.findComponent(FormSelect);
    expect(formSelect.exists()).toBe(true);
    expect(formSelect.props("options").length).toEqual(3);
  });

  it("updates the query computed value based on form inputs", async () => {
    const wrapper = mount(CodebaseSearch);

    const formTextInput = wrapper.findComponent(FormTextInput);
    const formTextInputElement = formTextInput.find("input");
    formTextInputElement.element.value = "test keyword";
    await formTextInputElement.trigger("input");
    await wrapper.vm.$nextTick();
    const baseSearch = wrapper.findComponent(BaseSearch);
    const searchUrl = baseSearch.props("searchUrl");
    expect(searchUrl).toContain("query=test%20keyword");
  });
});