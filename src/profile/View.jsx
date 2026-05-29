import React, { useEffect } from 'react'

export default function View({ state, ctrl }) {
  const actions = ctrl.store.actions

  useEffect(() => {
    ctrl.load()
  }, [])

  const inp = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: 16,
  }

  const labelStyle = { display: 'block', marginBottom: 6, width: 100 }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '14px 20px' }}>
        <span
          style={{ cursor: 'pointer', marginRight: 16, fontSize: 18, color: '#7dd3fc' }}
          onClick={() => ctrl.goHome()}
        >
          ‹ 首页
        </span>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>个人中心</span>
      </header>

      <div style={{ padding: 16, maxWidth: 520, margin: '0 auto' }}>
        {state.loading ? <p>加载中…</p> : null}
        {state.toast ? (
          <p style={{ color: state.toast === '已保存' ? '#67c23a' : '#f56c6c' }}>{state.toast}</p>
        ) : null}

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#fff' }}>
          <h3 style={{ marginTop: 0 }}>基本信息（开题：查询与修改）</h3>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <label style={labelStyle}>用户名</label>
            <input style={{ ...inp, background: '#f5f5f5' }} value={state.username} disabled readOnly />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <label style={labelStyle}>手机号</label>
            <input
              style={inp}
              placeholder="11 位手机号"
              maxLength={11}
              value={state.phone}
              onChange={(e) => actions.MERGE({ phone: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <label style={labelStyle}>身份证号</label>
            <input
              style={inp}
              placeholder="选填"
              value={state.idCard}
              onChange={(e) => actions.MERGE({ idCard: e.target.value })}
            />
          </div>

          <button
            type="button"
            style={{
              padding: '10px 20px',
              fontSize: 16,
              background: '#409eff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: state.saving ? 'not-allowed' : 'pointer',
            }}
            disabled={state.saving}
            onClick={() => ctrl.save()}
          >
            {state.saving ? '保存中…' : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  )
}
