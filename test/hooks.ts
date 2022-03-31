import sinon from "sinon";

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
    this.validRule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    this.invalidRule = sinon.spy((path, value, _ctx) => ({
      success: false,
      errors: [{
        value, name: "rule", path,
        code: "error_code",
        message: "An error occured"
      }]
    }));
    done();
  },
  afterEach(done) {
    sinon.restore(); // Restore Sinon
    done();
  }
} as mochaHooks;
