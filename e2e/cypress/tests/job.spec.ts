import { loginBeforeEach } from "../support/setup";
import { getDataCy, selectNextMonthDate } from "../support/util";
import "cypress-file-upload";

describe("Visit jobs page", () => {
  //JOBS PAGE

  it("should visit the jobs page", () => {
    cy.visit("/jobs");
    assert(cy.get("h1").contains("Jobs & Appointments"));
  });

  it("should be able to submit a job posting", function () {
    cy.fixture("data.json").then(data => {
      const user = data.users[0];
      const job = data.jobs[0];
      loginBeforeEach(user.username, user.password);
      cy.visit("/jobs");
      cy.contains("Post a job").click();
      getDataCy("job-title").type(job.title);
      getDataCy("job-description").type(job.description);
      getDataCy("job-summary").type(job.summary);
      getDataCy("external-url").type(job["external-url"]);
      selectNextMonthDate(getDataCy("application-deadline"), job["application-deadline"]);
      getDataCy("create-button").click();
      cy.wait(2000);
    });
  });

  it("should be able to verify job was submitted correctly", function () {
    cy.fixture("data.json").then(data => {
      const job = data.jobs[0];
      cy.visit("/jobs");
      assert(cy.get("h1").contains("Jobs & Appointments"));
      getDataCy("job-result").first().find("a").first().click();
      assert(cy.get("h1").contains(job.title));
      assert(cy.get("p").contains(job.description));
    });
  });
});
