module.exports = function(app, fs)
{
    app.get('/*',function(req,res){
        const url = req.url;
        res.render('.' + url, {
            title: "title ",
            length: 5
        })
    });
}
