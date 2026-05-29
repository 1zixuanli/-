import React, { useEffect, useRef } from 'react'
import { buildPath } from '../util/url'
const CITY_LIST_BY_LETTER = {
  B: ['北京'],
  C: ['成都', '重庆', '长沙', '长春'],
  D: ['大连'],
  F: ['福州'],
  G: ['广州', '贵阳'],
  H: ['杭州', '合肥', '哈尔滨', '海口', '呼和浩特'],
  J: ['济南'],
  K: ['昆明'],
  L: ['兰州', '拉萨'],
  N: ['南京', '南宁', '南昌'],
  Q: ['青岛'],
  S: ['上海', '深圳', '苏州', '沈阳', '石家庄'],
  T: ['天津', '太原'],
  W: ['武汉', '乌鲁木齐'],
  X: ['西安', '厦门', '西宁'],
  Y: ['银川'],
  Z: ['郑州'],
}

export default function View({ state, ctrl }) {
  const q = (state.location && state.location.query) || {}
  const current = (q.current && String(q.current)) || ''
  const mainRef = useRef(null)

  useEffect(() => {
    if (!current || !mainRef.current) return
    const el = mainRef.current.querySelector(`[data-city="${CSS.escape(current)}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [current])

  function goHomeWith(from, to) {
    ctrl.history.push(buildPath('/home', { from, to }))
  }

   function selectCity(city) {
    const field = q.field || 'from'
    const prevFrom = (q.from && String(q.from)) || ''
    const prevTo = (q.to && String(q.to)) || ''
    if (field === 'from') {
      goHomeWith(city, prevTo)
    } else {
      goHomeWith(prevFrom, city)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 16,
          background: '#fff',
          borderBottom: '1px solid #eee',
        }}
      >
               <span
          style={{ color: '#409eff', cursor: 'pointer', marginRight: 16 }}
          onClick={() =>
            goHomeWith(
              (q.from && String(q.from)) || '',
              (q.to && String(q.to)) || ''
            )
          }
        >
          返回
        </span>
        <span style={{ fontSize: 18, fontWeight: 600 }}>选择城市</span>
      </header>
      <main ref={mainRef} style={{ padding: 12, maxWidth: 600, margin: '0 auto' }}>
        {Object.keys(CITY_LIST_BY_LETTER).map((letter) => (
          <div key={letter} style={{ marginBottom: 16 }}>
            <div
              style={{
                padding: '8px 12px',
                background: '#f0f0f0',
                color: '#666',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {letter}
            </div>
            <div style={{ background: '#fff', borderRadius: 4 }}>
              {CITY_LIST_BY_LETTER[letter].map((city) => (
                <div
                  key={city}
                  data-city={city}
                  onClick={() => selectCity(city)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    background: city === current ? '#ecf5ff' : '#fff',
                    color: city === current ? '#409eff' : '#1a1a2e',
                    fontWeight: city === current ? 600 : 400,
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}