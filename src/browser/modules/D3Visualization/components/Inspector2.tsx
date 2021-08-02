/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { deepEquals, optionalToString } from 'services/utils'
import SVGInline from 'react-svg-inline'
import {
  inspectorFooterContractedHeight,
  StyledInspectorFooterStatusMessage,
  StyledTokenContextMenuKey,
  StyledTokenRelationshipType,
  StyledLabelToken,
  StyledStatusBar,
  StyledStatus,
  StyledInspectorFooter,
  StyledInspectorFooterRow,
  StyledInspectorFooterRowListPair,
  StyledInspectorFooterRowListKey,
  StyledInspectorFooterRowListValue,
  StyledInlineList,
  StyledStatusBar2,
  StyledStatus2,
  StyledInspectorFooter2
} from './styled'
import { GrassEditor } from './GrassEditor'
import { RowExpandToggleComponent } from './RowExpandToggle'
import ClickableUrls from '../../../components/ClickableUrls'
import numberToUSLocale from 'shared/utils/number-to-US-locale'
import { StyledTruncatedMessage } from 'browser/modules/Stream/styled'
import { Icon } from 'semantic-ui-react'
import ClipboardCopier from 'browser-components/ClipboardCopier'

const mapItemProperties = (itemId: string, itemProperties: any) => {
  const clipboardCopy = (textToCopy: string) => (
    <div style={{ marginLeft: 'auto' }}>
      <ClipboardCopier textToCopy={textToCopy} iconSize={15} />
    </div>
  )
  const allItemProperties = [`<id>: ${itemId}`]
  const sortedItemProperties = () => {
    return itemProperties.sort(({ key: keyA }: any, { key: keyB }: any) =>
      keyA < keyB ? -1 : keyA === keyB ? 0 : 1
    )
  }
  sortedItemProperties().map((prop: any) => {
    allItemProperties.push(`${prop.key}: ${prop.value}`)
  })

  const mappedItemProperties = () => {
    return sortedItemProperties().map((prop: any, i: any) => {
      return (
        <StyledInspectorFooterRowListPair
          className="pair"
          key={'prop' + i}
          style={{
            display: 'flex',
            background: `${(i + 1) % 2 === 0 ? 'white' : '#f0f0f0'}`
          }}
        >
          <StyledInspectorFooterRowListKey className="key">
            {prop.key + ': '}
          </StyledInspectorFooterRowListKey>
          <StyledInspectorFooterRowListValue className="value">
            <ClickableUrls text={optionalToString(prop.value)} />
          </StyledInspectorFooterRowListValue>
          {clipboardCopy(`${prop.key}: ${prop.value}`)}
        </StyledInspectorFooterRowListPair>
      )
    })
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: 'auto', marginRight: '5px' }}>
          <ClipboardCopier
            textToCopy={allItemProperties.join('\n')}
            iconSize={15}
            titleText={'Copy all properties to clipboard'}
          />
        </div>
      </div>
      <StyledInspectorFooterRowListPair
        key="pair"
        className="pair"
        style={{ display: 'flex', background: 'white' }}
      >
        <StyledInspectorFooterRowListKey className="key">
          {'<id>:'}
        </StyledInspectorFooterRowListKey>
        <StyledInspectorFooterRowListValue className="value">
          {itemId}
        </StyledInspectorFooterRowListValue>
        {clipboardCopy(`<id>: ${itemId}`)}
      </StyledInspectorFooterRowListPair>
      {mappedItemProperties()}
    </>
  )
}

const mapLabels = (graphStyle: any, itemLabels: any) => {
  return itemLabels.map((label: any, i: any) => {
    const graphStyleForLabel = graphStyle.forNode({ labels: [label] })
    const style = {
      backgroundColor: graphStyleForLabel.get('color'),
      color: graphStyleForLabel.get('text-color-internal')
    }
    return (
      <StyledLabelToken
        key={'label' + i}
        style={style}
        className={'token' + ' ' + 'token-label'}
      >
        {label}
      </StyledLabelToken>
    )
  })
}

type InspectorComponentState = any

export class InspectorComponent2 extends Component<
  any,
  InspectorComponentState
> {
  footerRowElem: any
  constructor(props: any) {
    super(props)
    this.state = {
      contracted: true,
      graphStyle: props.graphStyle
    }
  }

  setFooterRowELem(elem: any) {
    if (elem) {
      this.footerRowElem = elem
    }
  }

  render() {
    let item
    let type
    let inspectorContent

    item = this.props.selectedItem.item
    type = this.props.selectedItem.type

    if (item && (type === 'node' || type === 'relationship')) {
      if (
        this.props.hoveredItem &&
        (this.props.hoveredItem.type === 'node' ||
          this.props.hoveredItem.type === 'relationship')
      ) {
        item = this.props.hoveredItem.item
        type = this.props.hoveredItem.type
      }
    } else if (!item && this.props.hoveredItem.type === 'canvas') {
      item = this.props.hoveredItem.item
      type = this.props.hoveredItem.type
    }

    // console.log('++item 2', item)
    // console.log('++type 2', type)

    if (item && type) {
      // if (type === 'legend-item') {
      //   console.log('++legend-item')
      //   inspectorContent = (
      //     <GrassEditor
      //       selectedLabel={item.selectedLabel}
      //       selectedRelType={item.selectedRelType}
      //     />
      //   )
      // }
      // if (type === 'status-item') {
      //   console.log('++status-item')
      //   inspectorContent = (
      //     <StyledInspectorFooterStatusMessage className="value">
      //       {item}
      //     </StyledInspectorFooterStatusMessage>
      //   )
      // }
      // if (type === 'context-menu-item') {
      //   console.log('++context-menu-item')
      //   inspectorContent = (
      //     <StyledInlineList className="list-inline">
      //       <StyledTokenContextMenuKey
      //         key="token"
      //         className={
      //           'token' + ' ' + 'token-context-menu-key' + ' ' + 'token-label'
      //         }
      //       >
      //         <SVGInline svg={item.label} width="12px" />
      //       </StyledTokenContextMenuKey>
      //       <StyledInspectorFooterRowListPair key="pair" className="pair">
      //         <StyledInspectorFooterRowListValue className="value">
      //           {item.content}
      //         </StyledInspectorFooterRowListValue>
      //       </StyledInspectorFooterRowListPair>
      //     </StyledInlineList>
      //   )
      // }
      if (type === 'canvas') {
        // console.log('++canvas')
        const description = `Displaying ${numberToUSLocale(
          item.nodeCount
        )} nodes, ${numberToUSLocale(item.relationshipCount)} relationships.`
        inspectorContent = (
          <StyledInlineList className="list-inline">
            <StyledInspectorFooterRowListPair className="pair" key="pair">
              <StyledInspectorFooterRowListValue className="value">
                {this.props.hasTruncatedFields && (
                  <StyledTruncatedMessage>
                    <Icon name="warning sign" /> Record fields have been
                    truncated.&nbsp;
                  </StyledTruncatedMessage>
                )}
                {description}
              </StyledInspectorFooterRowListValue>
            </StyledInspectorFooterRowListPair>
          </StyledInlineList>
        )
      } else if (type === 'node') {
        // console.log('++node')
        inspectorContent = (
          <StyledInlineList className="list-inline">
            {mapLabels(this.state.graphStyle, item.labels)}
            {mapItemProperties(item.id, item.properties)}
          </StyledInlineList>
        )
      } else if (type === 'relationship') {
        // console.log('++relationship')
        const style = {
          backgroundColor: this.state.graphStyle
            .forRelationship(item)
            .get('color'),
          color: this.state.graphStyle
            .forRelationship(item)
            .get('text-color-internal')
        }
        inspectorContent = (
          <StyledInlineList className="list-inline">
            <StyledTokenRelationshipType
              key="token"
              style={style}
              className={'token' + ' ' + 'token-relationship-type'}
            >
              {item.type}
            </StyledTokenRelationshipType>
            {mapItemProperties(item.id, item.properties)}
          </StyledInlineList>
        )
      }
    }

    return (
      <StyledStatusBar2 className="status-bar">
        <StyledStatus2 className="status">
          <StyledInspectorFooter2
            className={
              // this.state.contracted
              //   ? 'contracted inspector-footer'
              //   :
              'inspector-footer'
            }
          >
            <StyledInspectorFooterRow
              data-testid="vizInspector"
              className="inspector-footer-row"
              ref={this.setFooterRowELem.bind(this)}
            >
              {/* {type === 'canvas' ? null : (
                <RowExpandToggleComponent
                  contracted={this.state.contracted}
                  rowElem={this.footerRowElem}
                  containerHeight={inspectorFooterContractedHeight}
                  onClick={this.toggleExpand.bind(this)}
                />
              )} */}
              {inspectorContent}
            </StyledInspectorFooterRow>
          </StyledInspectorFooter2>
        </StyledStatus2>
      </StyledStatusBar2>
    )
  }

  toggleExpand() {
    this.setState({ contracted: !this.state.contracted }, () => {
      const inspectorHeight = this.footerRowElem.clientHeight
      this.props.onExpandToggled &&
        this.props.onExpandToggled(
          this.state.contracted,
          this.state.contracted ? 0 : inspectorHeight
        )
    })
  }

  componentDidUpdate(prevProps: any) {
    if (!deepEquals(this.props.selectedItem, prevProps.selectedItem)) {
      this.setState({ contracted: true })
      this.props.onExpandToggled && this.props.onExpandToggled(true, 0)
    }
  }
}
