import _ from 'lodash';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { StyledTable } from '.';
import { Link } from 'react-router-dom';

const IcTableHeader = props => (
  <Table.HeaderCell sorted={props.column === props.key ? props.direction : null} onClick={props.handleSort(props.key)}>
    {props.children}
  </Table.HeaderCell>
);

class IcTable extends React.Component {
  state = {
    column: null,
    direction: null,
  };

  handleSort = clickedColumn => () => {
    const { column, direction } = this.state;
    const { data } = this.props;

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
    const { column, direction } = this.state;
    const { data } = this.props;
    return (
      <StyledTable sortable celled fixed compact selectable>
        <Table.Header>
          <Table.Row>
            {React.Children.map(this.props.children, child => {
              if (child.type === IcTableHeader) {
                return (
                  <IcTableHeader column={column} direction={direction} {...child.props} handleSort={this.handleSort} />
                );
              }
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, ({ id, key, orderDate, customerName }) => (
            <Table.Row key={id}>
              <Table.Cell selectable>
                <Link to={'/sales/sales-orders/' + id}>{key}</Link>
              </Table.Cell>
              <Table.Cell>{new Date(orderDate).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{customerName}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </StyledTable>
    );
  }
}

IcTable.Header = IcTableHeader;

export default IcTable;
