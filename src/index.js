import '@babel/polyfill';
import dva from 'dva';
import browserHistory from 'history/createBrowserHistory';
import './index.less'

const history = process.env.NODE_ENV === 'production' ? {history: browserHistory()} : {};

// 1. Initialize
const app = dva(history);

// 2. Plugins
//app.use();

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store;
