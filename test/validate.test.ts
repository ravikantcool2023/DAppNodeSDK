import { expect } from "chai";
import { Manifest } from "../src/releaseFiles/manifest/types";
import { validateSchema } from "../src/schemaValidation/validateSchema";

describe("utils / format", () => {
  it("validateManifest chainDriver as string", () => {
    const manifest: Manifest = {
      name: "",
      version: "1.0.0",
      description: "",
      type: "dncore",
      license: "1",
      chain: {
        driver: "ethereum"
      }
    };

    expect(() =>
      validateSchema({ type: "manifest", data: manifest })
    ).to.not.throw();
  });

  it("validateManifest chainDriver as object", () => {
    const manifest: Manifest = {
      name: "",
      version: "1.0.0",
      description: "",
      type: "dncore",
      license: "1",
      chain: "ethereum"
    };

    expect(() =>
      validateSchema({ type: "manifest", data: manifest })
    ).to.not.throw();
  });

  it("throw error validating", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const manifest: any = {
      name: "",
      version: "1.0.0",
      description: "",
      type: "dncore",
      license: "1",
      chain: "notAllowed"
    };

    expect(() =>
      validateSchema({ type: "manifest", data: manifest })
    ).to.throw();
  });
});
