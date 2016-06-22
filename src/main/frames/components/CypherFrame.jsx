import React from 'react'
import { FrameTitlebar } from './FrameTitlebar'
import asciitable from 'ascii-data-table'
import bolt from '../../../services/bolt/bolt'
// import tabNavigation from '../../../tabNavigation'
import neo4jVisualization from 'neo4j-visualization'

class CypherFrame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openView: 'text'
    }
  }

  onNavClick (viewName) {
    this.setState({openView: viewName})
  }

  getNodeNeighbours (node, callback) {
    const neighbourCypher = `MATCH path = (a)--(o)
            WHERE id(a)= ${node.id}
            RETURN path, size((a)--()) as c
            ORDER BY id(o)
            LIMIT 100`
    bolt.transaction(neighbourCypher).then((result) => {
      callback(bolt.extractNodesAndRelationshipsFromRecords(result.records))
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.frame.result !== this.props.frame.result) {
      this.state.nodesAndRelationships = bolt.extractNodesAndRelationshipsFromRecords(nextProps.frame.result.records)
      this.state.rows = bolt.recordsToTableArray(nextProps.frame.result.records)
    }
  }

  render () {
    const frame = this.props.frame
    const errors = frame.errors && frame.errors.fields || false
    const result = frame.result || false
    let frameContents = <pre>{JSON.stringify(result, null, 2)}</pre>
    if (result) {
      this.state.nodesAndRelationships = this.state.nodesAndRelationships || bolt.extractNodesAndRelationshipsFromRecords(result.records)
      if (this.state.nodesAndRelationships.nodes.length > 0) {
        frameContents = (
          <div className='frame'>
            <neo4jVisualization.GraphComponent useContextMenu getNodeNeighbours={this.getNodeNeighbours.bind(this)} nodes={this.state.nodesAndRelationships.nodes} relationships={this.state.nodesAndRelationships.relationships}/>
          </div>
        )
      } else {
        this.state.rows = this.state.rows || bolt.recordsToTableArray(result.records)
        frameContents = <pre>{asciitable.run(this.state.rows)}</pre>
      }
    } else if (errors) {
      frameContents = (
        <div>
          {errors[0].code}
          <pre>{errors[0].message}</pre>
        </div>
      )
    }
    return (
      <div className='frame'>
        <FrameTitlebar frame={frame} />
        <div className='frame-contents'>{frameContents}</div>
      </div>
    )
  }
}

export {
  CypherFrame
}
