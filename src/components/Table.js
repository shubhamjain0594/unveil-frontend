import React from 'react';
import config from '../config';
import PropTypes from 'prop-types';

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // if info is an Array object, and its length exceeds maxRows
            // slice to only include the beginning
            InfoRows: this.props.info,
            prevProps: this.props
        };
    }

    static propTypes = {
        // attributes of each table component
        type: PropTypes.string.isRequired,
        info: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        rotating: PropTypes.bool,
        maxRows: PropTypes.number,
        tableStyle: PropTypes.object,
        widthDistribution: PropTypes.array,
        numCols: PropTypes.number
    };

    static defaultProps = {
        rotating: false,
        maxRows: 0,
        tableStyle: {
            border: '0.1vw dashed #41FF00',
            borderCollapse: 'collapse',
            marginTop: '0',
            width: '100%',
            wordBreak: 'break-word',
            tableLayout: 'fixed'
        },
        widthDistribution: null,
        numCols: null
    };

    // Rolling list: removes the first row, add it to the end of the list
    updateRows = () => {
        if (this.state.InfoRows.length > 0) {
            this.setState({
                InfoRows: [ ...this.state.InfoRows.slice(1),
                    this.state.InfoRows[ 0 ] ]
            });
        }
    };

    componentDidMount() {
        if (this.props.rotating) {
            this.intervalId = setInterval(this.updateRows.bind(this), config.updateTime);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.prevProps === props) {
            return null;
        } else {
            return {
                InfoRows: props.info,
                prevProps: props
            };
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        if (this.props.rotating) {
            clearInterval(this.intervalId);
        }
    }

    render() {
        const data = this.props.maxRows ? this.state.InfoRows.length <=
        this.props.maxRows ? this.state.InfoRows: this.state.InfoRows.slice(
            0, this.props.maxRows +1): this.state.InfoRows;
        const noBorder = {
            border: 'none'
        };
        const manufacturerStyle = {
            fontWeight: 'bold'
        };
        const sensitiveStyle = {
            color: 'red',
            whiteSpace: 'nowrap'
        };
        let widthDistribution = {
            width: '2.5vw'
        };
        if (this.props.widthDistribution){
            widthDistribution = [];
            for (let i = 0; i < this.props.widthDistribution.length; i++){
                widthDistribution.push(
                    { width: this.props.widthDistribution[ i ] });
            }
        } else if (this.props.numCols) {
            widthDistribution = [];
            for (let i=0; i < this.props.numCols; i++)
                widthDistribution.push({ width: '2.5vw' });
        }
        return (
            <table style={ this.props.tableStyle }>
                <tbody>
                {// executed if data type is list
                    this.props.type === 'list' ?
                        data.map(function(row, index) {
                            return typeof row === 'object'?
                                <tr key={ `row${ index }` }>
                                    <td key={ `cell${ index }` }
                                        style={ Object.assign(
                                            noBorder, widthDistribution) }>
                                        {row[ 0 ]}<br/>{row[ 1 ]}
                                    </td>
                                </tr>:
                                <tr key={ `row${ index }` }>
                                    <td key={ `cell${ index }` }
                                        style={ widthDistribution }>{row}
                                    </td>
                                </tr>;
                        }) :
                        ((this.props.type === 'dict') ?
                            (Object.keys(data).map(function(dic_key, index) {
                                // executed if data is a dict
                                return dic_key==='Manufacturer' ?
                                    <tr key={ `${ index }key` }>
                                        <td key={ `cell${ index }` }
                                            style={ widthDistribution[ 0 ] }>
                                            {dic_key}
                                        </td>
                                        <td key={ `${ index }cell` }
                                            style={ Object.assign(
                                                manufacturerStyle,
                                                widthDistribution[ 1 ]) }>
                                            {data[ dic_key ]}
                                        </td>
                                    </tr>:
                                    <tr key={ `${ index }key` }>
                                        <td key={ `cell${ index }` }
                                            style={ widthDistribution[ 0 ] }>
                                            {dic_key}
                                        </td>
                                        <td key={ `${ index }cell` }
                                            style={ widthDistribution[ 1 ] }>
                                            {data[ dic_key ]}
                                        </td>
                                    </tr>;
                            })) :
                            (this.props.type === 'listOfListsAllItems') ?
                                (data.map(function(row, index) {
                                        // executed if data is a list of
                                        // any-length element lists
                                        return <tr key={ `row${ index }` }>{
                                            row.map(function(item, itemIndex) {
                                                return <td
                                                    key={ `cell${ itemIndex }` }
                                                    style={ widthDistribution[
                                                        itemIndex ] }>{item}
                                                </td>;
                                            })
                                        }
                                        </tr>;
                                    })
                                ):
                                // executed if list of lists:
                                // show only first element
                                data.map(function(row, index) {
                                    // for sorted DNS, assumes list is sorted
                                    // by importance
                                    return <tr key={ `${ index }row` }>
                                        {(row[ 1 ]==='sensitive')?
                                            <td key={ `cell${ index }` }
                                                style={ sensitiveStyle }>
                                                {row[ 0 ]}
                                            </td>:
                                            <td key={ `${ index }cell` }
                                                style={ widthDistribution }>
                                                {row[ 0 ]}
                                            </td>
                                        }
                                    </tr>;

                                }))

                }
                </tbody>
            </table>
        );
    }
}

export default Table;
