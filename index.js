import './style';
import { Component } from 'preact';
import { Display } from './display';

const Button = ({color, className, push, handler, arg, children}) => {
    const wrapper = (e) => {
        e.preventDefault();
        handler && handler(arg);
    };
    const pushClassName = push ? "button-push" : "";
    const style = color ? {backgroundColor: color} : {};
    return <button style={style}
        className={className || "" + " " + pushClassName}
        onClick={wrapper}>{children}</button>;
};
const SvgCircle = (props) => {
    const size = props.size || 20;
    const color = props.color || "black";
    return (
        <svg height={size} width={size}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
        </svg>
    );
};

class Menu extends Component {
    constructor(props) {
        super(props);
        this.toggleFullScreen = () => {
            if (document.webkitFullscreenElement === null) {
                props.window.webkitRequestFullScreen();
            } else {
                document.webkitExitFullscreen();
            }
            props.onClose();
        };
    }
    render(props, state) {
        return (
            <div class="menu">
                <Button handler={this.toggleFullScreen}>Full screen</Button>
                <Button handler={() => location.reload()}>Reload page</Button>
                <p>&copy; 2018 Andrey Trachenko</p>
                <p><a href="https://github.com/goodrone/learning-letters"
                      target="_blank">GitHub</a></p>
                <Button handler={props.onClose}>Close</Button>
            </div>
        );
    }
};

function preventViewportZoom() {
    document.addEventListener("DOMContentLoaded", () => {
        const viewport = document.querySelector("meta[name=viewport]");
        const content = viewport.getAttribute("content");
        viewport.setAttribute("content", content + ",user-scalable=no");
    });
}
// TODO: modify HTML template instead
if (typeof window !== "undefined") {
    preventViewportZoom();
}

import './flip.scss';
class Flipper extends Component {
    render({index, children}) {
        console.assert(children.length == 2);
        const classNames = ["flip-container", index ? "flip-flipped" : ""].join(" ");
        return (
            <div className={classNames}>
                <div className="flip-inside">
                    <div className="flip-front">{children[0]}</div>
                    <div className="flip-back">{children[1]}</div>
                </div>
            </div>
        );
    }
}

class Selector extends Component {
    render({items, onSelect}) {
        return (
            <div className="selector">
                {(items || []).map(item =>
                    <Button handler={onSelect}
                            arg={item.key}
                            className={item.className}
                            key={item.key}>{item.key}</Button>)}
            </div>
        );
    }
}

// TODO: this is a quick way to assign a function to be called
// when 'd' is pressed.  Useful for debugging - to avoid using mouse.
function setDebugKeyboardHandler(f) {
    document.addEventListener('keypress', (event) => {
        const keyName = event.key;
        if (keyName == 'd') {
            f();
        }
    });
}

if (typeof window !== "undefined") {
    require('hammerjs');
}

class Swiper extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const ref = this.ref;
        const handler = this.props.handler;
        this.mc = new Hammer(ref);
        this.mc.get("pan").set({ direction: Hammer.DIRECTION_ALL, threshold: 15 });
        this.mc.on("panup", function(ev) {
            handler();
        });
    }
    componentWillUnmount() {
        this.mc.destroy();
    }
    render() {
        return <header className="hide" ref={ref => this.ref = ref}>swipe up</header>;
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state.show = "display";
        this.state.text = null;
        this.items = [].concat(
            "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("").map(
                letter => ({key: letter})),
            "123456789".split("").map(
                letter => ({key: letter, className: "number"})),
        );
        this.onSelect = function onSelect(text) {
            this.showDisplay();
            this.setState({text});
        }.bind(this);
        this.clear = function clear() {
            this.onSelect(null);
        }.bind(this);
        this.showDisplay = this.showDisplay.bind(this);
        this.showSelector = this.showSelector.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.toggleDisplaySelector = this.toggleDisplaySelector.bind(this);
    }
    setHeader(elem) {
    }
    showDisplay() {
        this.setState({show: 'display'});
    }
    showSelector() {
        this.setState({show: 'selector'});
    }
    showMenu() {
        this.setState({show: 'menu'});
    }
    toggleDisplaySelector() {
        this.setState(state => {
            if (state.show === 'selector') {
                return {show: 'display'};
            }
            return {show: 'selector'};
        });
    }
    render(props, state) {
        const items = this.items;
        const flipperIndex = state.show === 'display' ? 0 : 1;
        const back = {
            selector: <Selector items={items} onSelect={this.onSelect}/>,
            menu: <Menu window={this.window} onClose={this.showDisplay}/>,
            display: null }[state.show];
        return (
            <div id="window" ref={ref => this.window = ref}>
                <Swiper handler={this.showMenu}/>
                <main>
                    <Flipper index={flipperIndex}
                        ref={flipper => { this.flipper = flipper }}>
                        <Display text={state.text}/>
                        {back}
                    </Flipper>
                </main>
                <footer>
                    <div className="buttons">
                        {this.state.text && <Button color="#d8d8d8"
                            handler={this.clear}><SvgCircle color="white"/></Button>}
                        <Button color="orange" push={true}
                                handler={this.toggleDisplaySelector}>
                                <SvgCircle color="white"/>
                        </Button>
                    </div>
                </footer>
            </div>
        );
    }
}
