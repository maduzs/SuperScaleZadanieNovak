import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('TaskMeta e2e test', () => {
  const taskMetaPageUrl = '/task-meta';
  const taskMetaPageUrlPattern = new RegExp('/task-meta(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const taskMetaSample = {};

  let taskMeta;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/task-metas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/task-metas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/task-metas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (taskMeta) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/task-metas/${taskMeta.id}`,
      }).then(() => {
        taskMeta = undefined;
      });
    }
  });

  it('TaskMetas menu should load TaskMetas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('task-meta');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TaskMeta').should('exist');
    cy.url().should('match', taskMetaPageUrlPattern);
  });

  describe('TaskMeta page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(taskMetaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TaskMeta page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/task-meta/new$'));
        cy.getEntityCreateUpdateHeading('TaskMeta');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskMetaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/task-metas',
          body: taskMetaSample,
        }).then(({ body }) => {
          taskMeta = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/task-metas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/task-metas?page=0&size=20>; rel="last",<http://localhost/api/task-metas?page=0&size=20>; rel="first"',
              },
              body: [taskMeta],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(taskMetaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TaskMeta page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('taskMeta');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskMetaPageUrlPattern);
      });

      it('edit button click should load edit TaskMeta page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskMeta');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskMetaPageUrlPattern);
      });

      it('edit button click should load edit TaskMeta page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskMeta');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskMetaPageUrlPattern);
      });

      it('last delete button click should delete instance of TaskMeta', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('taskMeta').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskMetaPageUrlPattern);

        taskMeta = undefined;
      });
    });
  });

  describe('new TaskMeta page', () => {
    beforeEach(() => {
      cy.visit(`${taskMetaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TaskMeta');
    });

    it('should create an instance of TaskMeta', () => {
      cy.get(`[data-cy="name"]`).type('bar gadzooks boo');
      cy.get(`[data-cy="name"]`).should('have.value', 'bar gadzooks boo');

      cy.get(`[data-cy="type"]`).select('STRING');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        taskMeta = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', taskMetaPageUrlPattern);
    });
  });
});
