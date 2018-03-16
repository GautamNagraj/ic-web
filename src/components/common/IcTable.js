import _ from 'lodash';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { StyledTable } from '.';
import { Link } from 'react-router-dom';

const IcTableHeader = props => (
  <Table.HeaderCell
    sorted={props.column === props.field ? props.direction : null}
    onClick={props.handleSort(props.field)}
  >
    {props.children}
  </Table.HeaderCell>
);

const IcTableCell = props => <Table.Cell>{props.children}</Table.Cell>;

class IcTable extends React.Component {
  state = {
    column: null,
    direction: null,
    data: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.data === null) {
      this.setState({ data: nextProps.data });
    }
  }

  handleSort = clickedColumn => () => {
    const { column, direction, data } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    const { column, direction, data } = this.state;
    return (
      <StyledTable sortable celled fixed compact selectable>
        <Table.Header>
          <Table.Row>
            {React.Children.map(this.props.children, child => {
              if (child.type === IcTableHeader) {
                return (
                  <IcTableHeader
                    column={column}
                    direction={direction}
                    {...child.props}
                    handleSort={() => this.handleSort(child.props.field)}
                  />
                );
              }
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {React.Children.map(this.props.children, child => {
            if (child.type !== IcTableHeader) {
              return child;
            }
          })}
        </Table.Body>
      </StyledTable>
    );
  }
}

IcTable.Header = IcTableHeader;
IcTable.Cell = IcTableCell;

export default IcTable;
