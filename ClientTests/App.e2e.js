import generalActions from "./Actions/General";
import appPage from "./Pages/App";

describe("Logon screen", function() {
  beforeEach(() => {
    generalActions.gotoRoot();
  });

  it("can logon and go to home page", function() {
    expect(appPage.title.getText()).toEqual("Hello Angular");
  });
});
