import React from 'react';
import SellPopUp from './SellPopUp.js';
import BuyPopUp from './BuyPopUp.js';

class PortfolioTable extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      stock_prices: {},
      stock_change: {},
      portfolio_prices: {},
      showSellPopUp: false,
      showBuyPopUp: false,
      popupStock: undefined
    }
  }

  sendStockUp(stock){
    this.props.onStockSelect(stock)
  }

  componentDidMount(){

    const priceObject = {};
    const changeObject = {};
    const portfolioObject = {};

    this.props.stocks.forEach((quote) => {
      priceObject[quote.symbol] = quote.latestPrice;
      changeObject[quote.symbol] = quote.changePercent;
    });

    this.props.portfolio.forEach((stock) => {
      portfolioObject[stock.symbol] = stock.avgPrice;
    })

    this.setState({stock_prices: priceObject, stock_change: changeObject, portfolio_prices: portfolioObject});
  }

  showSellPopUp = (stock) => {
    this.setState({showSellPopUp: !this.state.showSellPopUp, popupStock: stock})
  }

  showBuyPopUp = (stock) => {
    this.setState({showBuyPopUp: !this.state.showBuyPopUp, popupStock: stock})
  }

  whichColor = (stringToCheck) => {
    if(stringToCheck.charAt(0) === "-") {
      return {color: "#e91e63"}
    } else {
      return {color: "#4caf50"}
    }
  }

  totalMarketValueCalculator = (portfolioStocks) => {
      let totalValue = 0;
      for(let stock of portfolioStocks){
        let currentValue = this.state.stock_prices[stock.epic] * stock.count
        totalValue += currentValue;
      }
      return parseFloat(totalValue).toFixed(2);
  }

  totalBookCostCalculator = (portfolioStocks) => {
    let totalValue = 0;
    for(let stock of portfolioStocks){
      let currentValue = stock.avgPrice * stock.count
      totalValue += currentValue;
    }
    return parseFloat(totalValue).toFixed(2);
  }

  render() {

    const stockRow = this.props.portfolio.map((stock, index) => {
    const heartStyle = stock.favorite ? "heart_active" : "heart";

      return (
        <tr key={index}>
          <td><button className={heartStyle} onClick={()=> this.props.switchFavourite(stock.epic)}></button></td>
          <td className="ellipsis" onClick={()=>this.sendStockUp(stock)}>{stock.name}</td>
          <td className="epic">{stock.epic}</td>
          <td className="currentPrice">{this.state.stock_prices[stock.epic]}</td>
          <td className="changePercent" style={this.whichColor(`${this.state.stock_change[stock.epic]}`)}>{(parseFloat(`${this.state.stock_change[stock.epic]}`)*100).toFixed(3)}</td>
          <td className="sharesHeld">{stock.count}</td>
          <td className="totalMarketValue">${parseFloat(this.state.stock_prices[stock.epic] * stock.count).toFixed(2)}</td>
          <td className="totalBookCost">${parseFloat(stock.avgPrice * stock.count).toFixed(2)}</td>
          <td className="totalProfitLoss" style={this.whichColor(`${(this.state.stock_prices[stock.epic] * stock.count) - (stock.avgPrice * stock.count)}`)}>${parseFloat((this.state.stock_prices[stock.epic] * stock.count) - (stock.avgPrice * stock.count)).toFixed(2)}</td>
          {/* <td>{parseFloat(stock.avgChange).toFixed(2)}</td>
          <td>{parseFloat(stock.avgPrice).toFixed(2)}</td> */}
          <td><button className="buy button" onClick={() => this.showBuyPopUp(stock)}>buy</button></td>
          <td><button className="sell button" onClick={() => this.showSellPopUp(stock)}>sell</button></td>
        </tr>
      )
    })

    return (
      <section className="stock-table">
        <table cellSpacing="0">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Epic</th>
              <th>Current Price</th>
              <th>Change %</th>
              <th>Shares Held</th>
              <th>Total Market Value</th>
              <th>Total Book Cost</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            { this.state.showBuyPopUp ? <BuyPopUp stock={this.state.popupStock}
                                                  close={this.showBuyPopUp}
                                                  createStock={this.props.createStock}/> : undefined }
            { this.state.showSellPopUp ? <SellPopUp stock={this.state.popupStock}
                                                    close={this.showSellPopUp}
                                                    refreshPortfolio={this.props.refreshPortfolio}/> : undefined }
            { stockRow }
            <tr></tr>
          </tbody>
          <tfoot>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>${this.totalMarketValueCalculator(this.props.portfolio)}</th>
            <th>${this.totalBookCostCalculator(this.props.portfolio)}</th>
            <th style={this.whichColor(`${parseFloat((this.totalMarketValueCalculator(this.props.portfolio)) - (this.totalBookCostCalculator(this.props.portfolio))).toFixed(2)}`)}>${parseFloat((this.totalMarketValueCalculator(this.props.portfolio)) - (this.totalBookCostCalculator(this.props.portfolio))).toFixed(2)}</th>
            <th></th>
          </tfoot>
        </table>
      </section>
    )

  }
}

export default PortfolioTable
