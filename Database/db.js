const pool = require('./database');

class database  {

//executeQuery......
static async executeQuery(query, array){
    return new Promise(async(resolve, reject) => {
        console.log(query,array,"executeQuery")
        pool.query(query, array,(err, result) => {
        try {
            console.log(result)
            console.log(err)
            if (err) {
                reject({query, array, err, error_msg: 'Database_send_an_error' });
              
            }else if (result){
                 console.log(result)
                 let response = result.rows[0];
                 console.log(response)
                 let reponseKeys = Object.keys(response);
                 console.log(reponseKeys)
                 let { error, data } = JSON.parse(response[reponseKeys[0]])

                // var res = JSON.parse(result.rows[0]['om_lg_login']);
                console.log(error, data )
                if(error!= null){
                    reject(new Error(error))
                }else{
                    resolve (data)
                }
                

            }
        } catch (error) {
            return ('some_thing_went_worng')
        }
    });
    })
}

static async executeRawQuery(query, array){
    return new Promise(async(resolve, reject) => {
        console.log(query,array,"executeQuery")
        pool.query(query, array,(err, result) => {
        try {
            console.log(result)
            console.log(err)
            if (err) {
                reject({query, array, err, error_msg: 'Database_send_an_error' });
              
            }else if (result){
                 console.log(result)
                 resolve (result)
            }
        } catch (error) {
            return ('some_thing_went_worng')
        }
    });
    })
}
}


module.exports = database;
