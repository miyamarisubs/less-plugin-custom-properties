const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('less-plugin-custom-properties');

const { config = { variables: {} } } = explorer.searchSync() || {};

module.exports = class CustomProperties {
    install(
        {
            tree: { Call, Anonymous, Expression, Ruleset, Declaration, Selector, Element, Combinator },
            visitors,
        },
        manager,
        functions,
    ) {
        const call = (name, ...args) => new Call(name, [new Expression(args)]);

        class Visitor {
            constructor() {
                this.native = new visitors.Visitor(this);
                this.isPreEvalVisitor = true;
                this.isReplacing = true;
            }

            run(root) {
                return this.native.visit(root);
            }

            visitOperation(node) {
                return call('calc', node.operands[0], new Anonymous(node.op), node.operands[1]);
            }

            visitDeclaration(node) {
                if (!(typeof node.name === 'string') || !node.name.match(/^@/)) {
                    return node;
                }

                const declaration = new Declaration(node.name.replace(/^@/, '--'), node.value);

                if (node.parent.root || (node.parent.parent && node.parent.parent.type === 'Media' && node.parent.parent.parent.root)) {
                    return new Ruleset([new Selector([new Element(new Combinator(' '), ':root')], [])], [declaration]);
                }

                return declaration;
            }

            visitNegative(node) {
                return call('calc', new Anonymous('-1'), new Anonymous('*'), node.value);
            }

            visitVariable(node) {
                return call('var', new Anonymous(node.name.replace(/^@/, '--')));
            }
        }

        manager.addVisitor(new Visitor());

        functions.add('external', variable => {
            if (variable.type !== 'Keyword') {
                return call('var', variable);
            }

            const name = variable.value.replace(/^--/, '');

            if (!(name in config.variables)) {
                return call('var', variable);
            }

            return new Anonymous(String(config.variables[name]));
        });
    }
};
