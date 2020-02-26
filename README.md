# ⚠️ Atlaskit has moved ⚠️

Hi there!

If you’re reading this, you’re probably looking for the source code of some Atlaskit components. Unfortunately, that code no longer resides here as it’s all been moved to a new closed source location. Not to worry though, you can simply do one of the following:

## For non-Atlassian developers

To view the source of Atlaskit components, you can take a look at [this public mirror](https://bitbucket.org/atlassian/design-system-mirror/src/master/). Currently it is a simple, manual, one way mirror of the packages that are exposed externally which is updated sporadically.

- If you are looking to contribute back; this currently isn’t supported. Please raise an issue if you need to report a bug or suggest a feature.

## For Atlassian developers

If you’re looking to contribute to Atlaskit components, you can head over to the https://bitbucket.org/atlassian/atlassian-frontend and start working from there.

- If you have a local checkout with any inflight work, you can update your remote to point to the new repo and push any branches up there too (if they were already pushed before the 6th of January, go to the next step instead!)

```
git remote set-url origin git@bitbucket.org:atlassian/atlassian-frontend.git
git push # do this for any branches you have locally
```

Otherwise, feel free to just check it out directly and start working:

```
git clone git@bitbucket.org:atlassian/atlassian-frontend.git
```

## FAQ

### Why have these components all been moved / close sourced?

In an effort to improve how we manage frontend code across Atlassian, we needed to first co-locate all our front end code in the same place. As a result, we decided to close the Atlaskit repo for a short period of time before re-opening it. You can still view the source (Link coming very soon, this week for certain!)

### What does this mean for the licensing of these components?

We did not change the license of components as part of this move. Please refer to individual components for their licenses.

### Can i still use Atlaskit components in my project?

Absolutely!

### Where should I report any bugs?

All bugs / feature requests should be reporting at our Service Desk.

### Where can I find the docs for these components?

All the docs for Atlaskit components are still available at http://atlaskit.atlassian.com/ and will continue to remain up to date. Although, some components may eventually be removed from there (only internal ones that you’re very unlikely to have used, don’t worry!).
