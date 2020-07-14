import path from "path";
import chalk from "chalk";
import { BuilderCallback } from "yargs";
// Tasks
import { buildAndUpload } from "../tasks/buildAndUpload";
// Utils
import { getCurrentLocalVersion } from "../utils/versions/getCurrentLocalVersion";
import { verifyIpfsConnection } from "../utils/verifyIpfsConnection";
import { getInstallDnpLink } from "../utils/getLinks";
import { CliGlobalOptions } from "../types";

export const command = "build";

export const describe = "Build a new version (only generates the ipfs hash)";

interface CliCommandOptions {
  provider: string;
  timeout: string;
  upload_to: "ipfs" | "swarm";
}

export const builder: BuilderCallback<CliCommandOptions, unknown> = yargs =>
  yargs
    .option("p", {
      alias: "provider",
      description: `Specify an ipfs provider: "dappnode" (default), "infura", "localhost:5002"`,
      default: "dappnode"
    })
    .option("t", {
      alias: "timeout",
      description: `Overrides default build timeout: "15h", "20min 15s", "5000". Specs npmjs.com/package/timestring`,
      default: "15min"
    })
    .option("u", {
      alias: "upload_to",
      description: `Specify where to upload the release`,
      choices: ["ipfs", "swarm"],
      default: "ipfs"
    });

export const handler = async ({
  provider,
  timeout,
  upload_to,
  // Global options
  dir,
  silent,
  verbose
}: CliCommandOptions & CliGlobalOptions): Promise<void> => {
  // Parse options
  const ipfsProvider = provider;
  const swarmProvider = provider;
  const userTimeout = timeout;
  const uploadToSwarm = upload_to === "swarm";
  const nextVersion = getCurrentLocalVersion({ dir });
  const buildDir = path.join(dir, `build_${nextVersion}`);

  await verifyIpfsConnection(ipfsProvider);

  const buildAndUploadTasks = buildAndUpload({
    dir,
    buildDir,
    ipfsProvider,
    swarmProvider,
    userTimeout,
    uploadToSwarm,
    verbose,
    silent
  });

  const { releaseMultiHash } = await buildAndUploadTasks.run();

  console.log(`
  ${chalk.green("DNP (DAppNode Package) built and uploaded")} 
  Release hash : ${releaseMultiHash}
  ${getInstallDnpLink(releaseMultiHash)}
`);
};