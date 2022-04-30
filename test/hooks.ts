import Sinon from "sinon";

declare module "mocha" {
  export interface Context {
    validRule: sinon.SinonSpy;
    invalidRule: sinon.SinonSpy;
    ctx: Record<string, never>
  }
}

interface mochaHooks {
  beforeEach(this: Mocha.Context, done: Mocha.Done): Mocha.HookFunction,
  afterEach(this: Mocha.Context, done: Mocha.Done): Mocha.HookFunction,
}

export const mochaHooks = {
  beforeEach(done) {
    this.validRule = Sinon.spy(
      function validRule(_path, value, _ctx) {
        return {success: true, value};
      }
    );
    this.invalidRule = Sinon.spy(function invalidRule(path, value, _ctx) {
      return {
        success: false,
        errors: [{
          value, name: "rule", path,
          code: "error_code",
          message: "An error occured"
        }]
      };
    });
    done();
  },
  afterEach(done) {
    Sinon.restore(); // Restore Sinon
    done();
  }
} as mochaHooks;
