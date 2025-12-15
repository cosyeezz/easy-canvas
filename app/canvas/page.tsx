'use client'

import React, { useState, useRef, useCallback } from 'react'
import { WorkflowWithInnerContext } from '@/app/components/workflow/index'
import { BlockEnum } from '@/app/components/workflow/types'
import { CUSTOM_NODE } from '@/app/components/workflow/constants'
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { availableNodesMetaData } from './node-defaults'

export default function CanvasPage() {
  const initialNodes = [
    {
      id: 'start',
      type: CUSTOM_NODE,
      data: { title: 'Start', type: BlockEnum.Start, desc: 'Start Node', variables: [] },
      position: { x: 100, y: 100 },
    },
    {
      id: 'end',
      type: CUSTOM_NODE,
      data: { title: 'End', type: BlockEnum.End, desc: 'End Node', outputs: [] },
      position: { x: 600, y: 100 },
    },
  ]
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState([])

  const workflowDataRef = useRef<{ nodes: any[], edges: any[] }>({ nodes: initialNodes, edges: [] })

  const handleWorkflowDataUpdate = useCallback((payload: any) => {
    workflowDataRef.current = { nodes: payload.nodes, edges: payload.edges }
  }, [])

  const handleExportDSL = useCallback(async () => {
    const data = workflowDataRef.current
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.dsl.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <EventEmitterContextProvider>
      <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <WorkflowWithInnerContext
          nodes={nodes}
          edges={edges}
          onWorkflowDataUpdate={handleWorkflowDataUpdate}
          hooksStore={{
            availableNodesMetaData,
            handleExportDSL,
          }}
        />
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
           <button
              onClick={handleExportDSL}
              style={{
                padding: '8px 16px',
                backgroundColor: '#155EEF', // Dify primary blue
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '14px'
              }}
           >
              Export DSL
           </button>
        </div>
      </div>
    </EventEmitterContextProvider>
  )
}
