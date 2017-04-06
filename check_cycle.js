var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'nt71li6axbkq1q6a.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'fi7jkxtj94gpzuow',
        password: 'v4xtcyrx27f4ho9k',
        database: 'uy5d6q1uth4xzbs8',
        charset: 'utf8'
    }
});

function checkCycle() {
    var date = new Date();

    knex("v_cycles")
        .where('ended', false)
        .asCallback(function(err, values) {
            if(err) return console.log(err);

            if(values.length === 0) startNewCycle(date);
            else knex.destroy();
        });
}


function startNewCycle(start) {
    var end = new Date();
    end.setDate(start.getDate()+7);

    knex.insert({
        start_date: start,
        end_date: end
    })
        .into("cycles")
        .asCallback(function(err, value) {
            if(err) {
                console.log(err);
            } else {
                console.log(value);
            }
            knex.destroy();
        });
}

checkCycle();