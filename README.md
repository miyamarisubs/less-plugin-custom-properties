# less-plugin-custom-properties

> LESS plugin to transform LESS variables to CSS custom properties

## Install

```bash
$ yarn add -D less-plugin-custom-properties
```

## Example

```less
@plugin 'custom-properties';

@bg: #000; // Declare
@fg: #fff;
@font: external(--font); // Use external (see below)

@media (print) {
    @bg: #fff; // Override
    @fg: #000;
}

.page {
    background-color: @bg; // Use
    color: @fg;
    width: 100% - 100px; // Bonus
}

// ↓↓↓↓

:root {
    --bg: #000;
    --fg: #fff;
    --font: Roboto, sans-serif;
}

@media (print) {
    :root {
        --bg: #fff;
        --fg: #000;
    }
}

.page {
    background-color: var(--bg);
    color: var(--fg);
    width: calc(100% - 100px);
}
```

## Configuration

### `less-plugin-custom-properties.config.js`

```javascript
module.exports = {
    // Define external variables:
    variables: {
        font: 'Roboto, sans-serif',
    },
};
```

## Limitations

Avoid of using variables in non-declaration contexts (e.g. in media).
Currently variables in such contexts may be transformed to invalid CSS.

_Instead you can use `postcss-custom-media` and/or `postcss-managed-media`._

## License

MIT
