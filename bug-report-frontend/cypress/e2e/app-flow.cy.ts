describe('User Registration, Login, Bug Creation, and Commenting', () => {
  const username = `testuser_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'TestPass123!';

  it('should register a new user', () => {
    cy.visit('/auth/register');
    cy.get('input[formcontrolname="username"]').type(username);
    cy.get('input[formcontrolname="email"]').type(email);
    cy.get('input[formcontrolname="password"]').type(password).blur();
    cy.get('input[formcontrolname="confirmPassword"').type(password).blur();
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait(200);
    cy.url().should('not.include', '/register');
  });

  it('should log in with the new user', () => {
    cy.visit('/auth/login');
    cy.get('input[formcontrolname="username"], input[formcontrolname="email"]').type(email);
    cy.get('input[formcontrolname="password"]').type(password);
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.url().should('not.include', '/login');
  });

  it('should create a new bug report', () => {
    cy.visit('/bugs');
    cy.contains('New Bug Report').click();

    cy.get('input[formcontrolname="title"]').type('E2E Test Bug');
    cy.get('textarea[formcontrolname="description"]').type('This bug was created by an E2E test.');
    cy.get('mat-select[formcontrolname="status"]').click();
    cy.get('mat-option').contains('RECEIVED').click();
    cy.get('button[type="submit"]').contains(/submit/i).should('not.be.disabled').click();

    cy.contains('E2E Test Bug').should('exist');
  });

  it('should add a comment to the bug', () => {
    cy.contains('E2E Test Bug').click();
    cy.get('textarea[formcontrolname="text"]').type('This is an E2E test comment.');
    cy.get('button[type="submit"]').contains(/post|add/i).should('not.be.disabled').click();

    cy.contains('This is an E2E test comment.').should('exist');
  });
});
