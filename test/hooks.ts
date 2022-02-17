import sinon from "sinon";

interface mochaHooks {
  afterEach(done: Mocha.Done): Mocha.HookFunction,
}

export const mochaHooks = {
  afterEach(done) {
    sinon.restore(); // Restore Sinon
    done();
  }
} as mochaHooks;
