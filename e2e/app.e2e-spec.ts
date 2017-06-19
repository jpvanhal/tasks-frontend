import { TasksFrontendPage } from './app.po';

describe('tasks-frontend App', () => {
  let page: TasksFrontendPage;

  beforeEach(() => {
    page = new TasksFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
