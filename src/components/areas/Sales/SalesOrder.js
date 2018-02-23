import _ from "lodash";
import React from "react";
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";
import ControlPanel from "../../common/ControlPanel";
import { api } from "../../common/Utilities";
import List from "semantic-ui-react/dist/commonjs/elements/List/List";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import styled from "styled-components";
import Message from "semantic-ui-react/dist/commonjs/collections/Message/Message";
import Image from "semantic-ui-react/dist/commonjs/elements/Image/Image";
import innovicLogo from "../../../img/innovic-logo.png";
import { FlatButton, StyledTable } from "../../common";

const SalesOrderSection = styled(Message)`
  &&& {
    margin: 15px auto;
    border-radius: 0;
    background: #fff;
  }
  @media screen {
    width: 80%;
  }
`;

class SalesOrder extends React.Component {
  state = {
    column: null,
    data: null,
    direction: null,
    loading: true,
    salesOrder: {
      key: ""
    }
  };

  componentDidMount() {
    let config = {
      onDownloadProgress: progressEvent => this.setState({ loading: true })
    };
    api
      .get("/salesorders/" + this.props.match.params.id, config)
      .then(response => {
        this.setState({
          data: response.data.salesOrderItems,
          loading: false,
          salesOrder: response.data
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  render() {
    const { column, data, direction } = this.state;
    return (
      <div>
        <ControlPanel
          title={"Sales Orders / " + this.state.salesOrder.key}
          loading={this.state.loading}
          className="no-print"
        >
          <FlatButton primary size="tiny" onClick={() => window.print()}>
            Print Invoice
          </FlatButton>
        </ControlPanel>
        <SalesOrderSection>
          <Grid divided="vertically" className="no-screen">
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image src={innovicLogo} size="medium" />
              </Grid.Column>
              <Grid.Column textAlign="right">
                Address : Plot No: 11/1/A, Phase - II, GIDC Estate V U Nagar,<br />
                Anand, Gujarat (INDIA) - 388121 <br />
                Contact Person : Vinay Makwana<br />
                Mobile : + 91 99099 20457 / + 91 98793 36897 <br />
                E-Mail Id : japan@innovictechnology.com <br />
                Website : www.innovictechnology.com<br />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <h1>{this.state.salesOrder.key}</h1>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <List celled>
                  <List.Item>
                    <List.Content>
                      <List.Header>Customer</List.Header>
                      {this.state.salesOrder.customerName}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Expiration Date</List.Header>
                      {new Date(
                        this.state.salesOrder.expirationDate
                      ).toLocaleDateString()}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Order Date</List.Header>
                      {new Date(
                        this.state.salesOrder.orderDate
                      ).toLocaleDateString()}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Payment Terms</List.Header>
                      {this.state.salesOrder.paymentTerms}
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List celled>
                  <List.Item>
                    <List.Content>
                      <List.Header>Created On</List.Header>
                      {new Date(
                        this.state.salesOrder.createdOn
                      ).toLocaleDateString()}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Last Modified On</List.Header>
                      {new Date(
                        this.state.salesOrder.lastModifiedOn
                      ).toLocaleDateString()}
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <StyledTable sortable celled fixed compact selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === "number" ? direction : null}
                  onClick={this.handleSort("number")}
                >
                  Item Number
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "materialNumber" ? direction : null}
                  onClick={this.handleSort("materialNumber")}
                >
                  Material Number
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "description" ? direction : null}
                  onClick={this.handleSort("description")}
                >
                  Description
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "unitPrice" ? direction : null}
                  onClick={this.handleSort("unitPrice")}
                >
                  Unit Price
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "quantity" ? direction : null}
                  onClick={this.handleSort("quantity")}
                >
                  Quantity
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "value" ? direction : null}
                  onClick={this.handleSort("value")}
                >
                  Value
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(
                data,
                ({
                  id,
                  number,
                  materialNumber,
                  description,
                  unitPrice,
                  quantity,
                  value
                }) => (
                  <Table.Row key={id}>
                    <Table.Cell>{number}</Table.Cell>
                    <Table.Cell>{materialNumber}</Table.Cell>
                    <Table.Cell>{description}</Table.Cell>
                    <Table.Cell>{unitPrice}</Table.Cell>
                    <Table.Cell>{quantity}</Table.Cell>
                    <Table.Cell>{value}</Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </StyledTable>

          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column />
              <Grid.Column>
                <List celled>
                  <List.Item>
                    <List.Content>
                      <List.Header>Total Items</List.Header>
                      {this.state.data ? this.state.data.length : ""}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Total Value</List.Header>
                      {_.sumBy(this.state.data, si => si.value)}
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </SalesOrderSection>
      </div>
    );
  }
}

export default SalesOrder;
