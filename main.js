// GitHub https://github.com/andrewelizev/a-level-js-hw11

// Lesson 11



function createStore(reducer) {
    let callbacks = [];
    let state = reducer(undefined, {});

    return {
        dispatch(action) {
            const newState = reducer(state, action);

            if (newState !== state) {
                state = newState;
                for (const cb of callbacks) {
                     cb();
                }
            }
        },
        subscribe(callback) {
            callbacks.push(callback);
            return function() {
                return callbacks = callbacks.filter(c => c !== callback);
            };
        },
        getState() {
            return state;
        }
    };
}

const cartReducer = (state = {}, { type, id, amount = 1 }) => {
    if (type === 'ADD') {
        return { ...state, [id]: amount + (state[id] || 0) };
    } else if (type === 'DEL') {
        delete state[id];
        return { ...state };
    }

    return state;
};

const actionInc = id => ({ type: 'ADD', id });
const actionAdd = (id, amount = 1) => ({ type: 'ADD', id, amount });
const actionRemove = (id) => ({ type: 'DEL', id });
const actionDec = (id, amount = -1) => ({ type: 'ADD', id, amount });

let dom = document.getElementById('store');
let basket = document.getElementById('basket');

let entityTitle = document.getElementById('entity-title');
let entityAmount = document.getElementById('entity-amount');

let btnAdd = document.getElementById('btn-add');
let btnRemove = document.getElementById('btn-remove');

let store = createStore(cartReducer);
let unsubscribe = store.subscribe(() => console.log(store.getState()));

btnAdd.onclick = () => {
    return store.dispatch(actionAdd(entityTitle.value, +entityAmount.value));
};

btnRemove.onclick = () => {
    return store.dispatch(actionRemove(entityTitle.value, +entityAmount.value));
};

const btnInc = (id) => store.dispatch(actionAdd(id));
const btnDec = (id) => store.dispatch(actionDec(id));
const btnDel = (id) => store.dispatch(actionRemove(id));


store.subscribe(() => dom.innerHTML = `<table>${Object.entries(store.getState()).map(([id, count]) => `<tr><th>${id}</th><td>${count}</td>
                                       <td><button type="button" onclick="btnInc('${id}')">Inc(+)</button></td>
                                       <td><button type="button" onclick="btnDec('${id}')">Dec(-)</button></td>
                                       <td><button type="button" onclick="btnDel('${id}')">Del</button></td>
                                       </tr>`).join('\n')}</table>`);

store.subscribe(() => basket.innerHTML = `<h1>${Object.entries(store.getState()).length}</h1>`);