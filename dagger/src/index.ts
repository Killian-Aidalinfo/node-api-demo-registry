import { dag, Container, Directory, object, func, Secret } from "@dagger.io/dagger"

@object()
export class NodeApiDemo {

  @func()
  async publish(source: Directory, secretScaleway: Secret): Promise<string> {
    return await this.build(source)
      .withRegistryAuth("rg.fr-par.scw.cloud/namespace-great-wilson","nologin",secretScaleway)
      .publish("rg.fr-par.scw.cloud/namespace-great-wilson/node-api-demo")
  }

  @func()
  build(source: Directory): Container {
    const devDirectory = this.dev(source)
    return dag
      .container()
      .withDirectory("/app", devDirectory)
      .build(devDirectory,{dockerfile: "Dockerfile"})
  }


  @func()
  dev(source: Directory): Directory {
    const nodeCache = dag.cacheVolume("node")
    const npmInstall = dag
        .container()
        // start from a base Node.js container
        .from("node:lts")
        // add the source code at /src
        .withDirectory("/app", source)
        // mount the cache volume at /root/.npm
        .withMountedCache("/root/.npm", nodeCache)
        // change the working directory to /src
        .withWorkdir("/app")
        // run npm install to install dependencies
        .withExec(["npm", "install"])
    // Return directory
    return npmInstall.directory("/app")
  }

}