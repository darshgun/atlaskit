# Synchrony

_This step is not mandatory. If you don't have access for these steps, you can use our mock version to simulate a collab session._

## How run Atlaskit website with Synchrony Collab Editing

Now you should install the required package globally. Keep in mind this is a private package and your should required access to download that. Since you have the proper access, install the package globally by running the command:

```
yarn global add @atlassian/prosemirror-synchrony-plugin
```

After that, link the package in website folder located in Atlaskit repository.

```
# access your global package and create the link using yarn
cd "\$(yarn global dir)/node_modules/@atlassian/prosemirror-synchrony-plugin" && yarn link
# now move back to your atlaskit repository, access the folder `website`
# and link the folder with the required package
cd <your-atlaskit-folder>/packages/editor/synchrony-test-helpers && yarn link "@atlassian/prosemirror-synchrony-plugin"
```

Then, go back to the root folder of Atlaskit repository, rerun the website again passing 'SYNCHRONY_URL={URL}' environment variable as a prefix for your command.

```
cd <your-atlaskit-folder> # access your atlaskit repository locally
SYNCHRONY_URL={URL} bolt <your-command> # run your command locally
```

## How to setup a local synchrony server

Check out the [How to guide](https://product-fabric.atlassian.net/wiki/spaces/E/pages/993887832/HOWTO+Getting+up+a+local+Synchrony+Server)
