describe('Dashboard', () => {
  // we can use these values to log in
  const email = 'dev@tooljet.io';
  const password = 'password';

  beforeEach(() => {
    cy.login(email, password);
    cy.wait(1000)
    cy.get('body').then(($title=>
        {
          //check you are not running tests on empty dashboard state
          if($title.text().includes('You haven\'t created any apps yet.'))
          {
            cy.get('a.btn').eq(0).should('have.text','Create your first app')
            .click()
            cy.go('back')
          }
        }))
    
  })

  it('should show site header with nav items', () => {
    cy.get('.navbar')
      .find('.navbar-nav')
      .should('be.visible');
  });

  it('should navigate to users page using users tab', () => {
    cy.get('.navbar')
      .find('.navbar-nav')
      .find('li').not('.active')
      .click();
    cy.location('pathname').should('equal', '/users');
    cy.get('.page-title').should('have.text', 'Users & Permissions');
    cy.get('[data-testid="usersTable"]').should('be.visible');
  })

  it('should navigate to apps page using apps tab', () => {
    cy.get('.navbar')
      .find('.navbar-nav')
      .find('li.active')
      .click();
    cy.location('pathname').should('equal', '/');
    cy.get('.page-title').should('have.text', 'All applications');
    cy.get('[data-testid="appsTable"]').should('be.visible');
  })

  it('should show user avatar and logout the user when user clicks logout', () => {
    cy.get('[data-testid="userAvatarHeader"]').should('be.visible');
    // TODO - Add functionality to detect when user hovers over the avatar,
    // Issues with hover functionality and hide/show of dom elements
  })
  
  it('should show list of application folders', () => {
    cy.get('[data-testid="applicationFoldersList"]')
      .should('be.visible');
  });

  it('should show correct number of applications in the count bubble of "All Applications" list', () => {
    cy.get('[data-testid="allApplicationsCount"]').then(($countBubble) => {
      cy.get('[data-testid="appsTable"]')
        .wait(500)
        .find("tr")
        .then((row) => {
          expect(Number($countBubble.text())).to.equal(row.length)
        });
    });
  });
})
