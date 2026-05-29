import React from 'react'

export default function View({ state, ctrl }) {
  const actions = ctrl.store.actions

  const tabStyle = (name) => ({
    padding: '8px 20px',
    cursor: 'pointer',
    background: state.activeTab === name ? '#fff' : '#f0f0f0',
    fontWeight: state.activeTab === name ? 600 : 400,
  })

  const inp = {
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 12,
    padding: '10px 12px',
    fontSize: 16,
  }
  const btn = {
    width: '100%',
    padding: '12px 0',
    marginTop: 8,
    fontSize: 16,
    background: '#409eff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <div
        style={{
          width: 400,
          padding: 32,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h1 style={{ textAlign: 'center', fontSize: 22 }}>铁路车票售卖系统</h1>
        {state.toast ? (
          <p style={{ color: '#f56c6c', fontSize: 14 }}>{state.toast}</p>
        ) : null}

        <div style={{ display: 'flex', marginBottom: 16 }}>
          <div style={tabStyle('login')} onClick={() => actions.MERGE({ activeTab: 'login' })}>
            登录
          </div>
          <div style={tabStyle('register')} onClick={() => actions.MERGE({ activeTab: 'register' })}>
            注册
          </div>
        </div>

        {state.activeTab === 'login' ? (
          <div>
            <input
              style={inp}
              placeholder="用户名"
              value={state.loginUsername}
              onChange={(e) => actions.MERGE({ loginUsername: e.target.value })}
            />
            <input
              style={inp}
              type="password"
              placeholder="密码"
              value={state.loginPassword}
              onChange={(e) => actions.MERGE({ loginPassword: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && ctrl.submitLogin()}
            />
            <button
              style={btn}
              disabled={state.loginLoading}
              onClick={() => ctrl.submitLogin()}
            >
              {state.loginLoading ? '登录中…' : '登录'}
            </button>
          </div>
        ) : (
          <div>
            <input
              style={inp}
              placeholder="用户名（3～20 位）"
              value={state.registerUsername}
              onChange={(e) => actions.MERGE({ registerUsername: e.target.value })}
            />
            <input
              style={inp}
              type="password"
              placeholder="密码（6～20 位）"
              value={state.registerPassword}
              onChange={(e) => actions.MERGE({ registerPassword: e.target.value })}
            />
            <input
              style={inp}
              type="password"
              placeholder="再次输入密码"
              value={state.registerConfirm}
              onChange={(e) => actions.MERGE({ registerConfirm: e.target.value })}
            />
            <input
              style={inp}
              placeholder="手机号"
              value={state.registerPhone}
              onChange={(e) => actions.MERGE({ registerPhone: e.target.value })}
            />
            <input
              style={inp}
              placeholder="身份证号（选填）"
              value={state.registerIdCard}
              onChange={(e) => actions.MERGE({ registerIdCard: e.target.value })}
            />
            <button
              style={btn}
              disabled={state.registerLoading}
              onClick={() => ctrl.submitRegister()}
            >
              {state.registerLoading ? '注册中…' : '注册'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}