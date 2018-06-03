三个API：

1、createStore

2、compose

3、applyMiddleware

示例：
```
import {createStore,compose,applyMiddleware} from './mini-redux'

const store = createStore(reducer,applyMiddleware(thunk))
```

