const fetch = require("node-fetch");

const saveLogisticsRequest = async(logisticsRequest) => {

    console.log(`${new Date().toLocaleString('ru')} Gonna save logisticsRequests: `, logisticsRequest);

    if('_id' in logisticsRequest) {
        delete logisticsRequest._id;
    }
    if('createdAt' in logisticsRequest) {
        delete logisticsRequest.createdAt;
    }
    if('updatedAt' in logisticsRequest) {
        delete logisticsRequest.updatedAt;
    }
    if('__v' in logisticsRequest) {
        delete logisticsRequest.__v;
    }

    try{
        const response = await fetch(`${process.env.BACK_HOST}v2/logisticsRequests/add`, {
            method: 'post',
            body: JSON.stringify({
                logisticsRequest: logisticsRequest,
                st: process.env.SECRET
            }),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await response.json();
        console.log(`${new Date().toLocaleString('ru')} Saving logisticsRequests response: `, result);
        return result;
    } catch(e) {
        return false;
    }
}

const getLogisticsRequestFromDbByTimestamp = async(timestamp) => {
    try{
        console.log(`${new Date().toLocaleString('ru')} Gonna get logistics request for date: `, timestamp);
        const response = await fetch(`${process.env.BACK_HOST}v2/logisticsRequests/timestamp?${new URLSearchParams({ timestamp, st: process.env.SECRET })}`);
        const result = await response.json();
        // console.log(`${new Date().toLocaleString('ru')} Got request result length: `, result.length);
        if(!result.length) {
            return false;
        }
        const lastOne = result.reduce((acc, requestObj) => {
            if(new Date(requestObj.updatedAt) > new Date(acc.updatedAt)) {
                acc = requestObj;
            }
            return acc;
        }, result[0]);
        return lastOne;
    } catch (e) {
        return false;
    }
}

const getLastRowIndexWithValue = (sheet) => {
    const newRowCount = sheet.rowCount;
    let lastRowIndexWithValue = 0;
    for(let index = 0; index < newRowCount; index++) {
        console.log(`${new Date().toLocaleString('ru')} Gonna check cell C${index+1}`);
        console.log(`${new Date().toLocaleString('ru')} Value of cell C${index+1}: `, sheet.getCellByA1(`C${index+1}`).value);
        if(!sheet.getCellByA1(`C${index+1}`).value) {
            lastRowIndexWithValue = index;
            break;
        }
    }
    return lastRowIndexWithValue;
}

module.exports = {
    saveLogisticsRequest,
    getLastRowIndexWithValue,
    getLogisticsRequestFromDbByTimestamp
};