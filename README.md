# Universal Utility Symbols

These are symbols you can use across your packages.

They use the symbol registry, but prefixed with a UUID. This ensures peer
versions and future versions of this package won't cause issues.

If you want to be extra cautious, fork this repository and change the
UUID prefix, then use the fork in your packages.

Here's how you use it:

```bash
npm install universal-symbols
```

```javascript
import { MEMOIZED } from 'universal-symbols';

const my_object = {
    // Normal properties
    a: 1,
    b: 2,
    c: 3,
    // Symbol property
    [MEMOIZED]: {},
};
```

For a comprehensive list of symbols, just read [the source file](./index.js).

### Why not just use `const NAME = Symbol('name')`?

Using `const NAME = Symbol('name')` is fine if you're doing so within
a single package. If your package will be a dependency of other packages,
there may be different versions of your package installed which will have
their own instances of the symbol. As other packages pass them around you
will find that one `NAME` won't be equal to another `NAME` - oof!

Now, there are two solutions for this - one from javascript itself, the
other from how `npm` works.

#### Solution with `Symbol.for`

You can use `Symbol.for` to use the global symbol registry. All packages
that reference `Symbol.for('CAT')` will actually get the same Symbol.

This effectively doubles the set of infinity keys that objects can have.
Yes, it sounds weird to "double" infinity, but you're sentient meat and
that's pretty weird too.

Collisions are definitely possible here too. This repo prefixes symbol
keys with a UUID to avoid this. However, packages using symbols from this
package for a different purpose than how you're using those symbols could
be in conflict as well. (that's why we suggest forking and changing the
UUID if you want to be extra cautious)

Other packages in the [Bikeshed Sanctuary](https://github.com/bikeshed-sanctuary)
organization will use these symbols in places where we want to accept
javascript objects that may use any of the following:
- string keys
- non-registered symbols
- registered symbols

Having this particular set of symbols, prefixed with the UUID, makes a
conflict much less likely, while still allowing references across symbols

#### Solution with peer dependencies

`npm` has an awareness of something called "peer dependencies". It's a
little difficult to understand but absolutely critical to understand
well. Here's an attempt at a clear explanation:

Consider this "happy" situation:
- You have a package "A" with dependencies "B" and "C"
- Dependencies "B" and "C" depend on "D", as a **peer dependency**
- "B" wants "D" at any major version `2`
- "C" wants "D" at any version above `2.5.1`
- `npm` will install one copy of "D" at version `2.9`

...and this "sad" situation:
- You have a package "A" with dependencies "B" and "C"
- Dependencies "B" and "C" depend on "D", as a **peer dependency**
- "B" wants "D" at exactly `2.6`
- "C" wants "D" at any version above `2.7`
- `npm` will throw an error and not install "D"

If we didn't use peer dependencies `npm` would install two copies
of "D" at different versions ant successfully complete. You might
then wonder why we would use peer dependencies at all if it just
makes it more likely a package will eventually break.

Here's why: all versions of package "D" at `2.x.x` have compatible
interfaces, but opaque objects/symbols produced by that interface
may have internal behavior that differs between versions. Unless
you do integrations test between your package and every other
version of your package, including future versions when they're
released, you have absolutely no guarentees that anything will work
the way you expected. You could have 100% test coverage in your
repo and practically 0% coverage for peer use. This level of testing
is not feasible in most realistic scenarios.

Peer dependencies would also allow the same `Symbol` to be used. However,
if you don't have to worry about internal behavior destroying API
compatibility, you can avoid using peer dependencies and use this package
instead. You don't want to introduce peer dependencies if you actually
need the guarentees it's providing.
