describe("initial test", () => {
  it("should visit", () => {
    cy.visit("/");
    assert(cy.get("h1").contains("something that it doesn't"));
  });
});
