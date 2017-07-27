

var cronHandler = {

    deleteAgendas: function (req, res) {
        console.log('Agendas deleted');
        res.json({ success: true, msg: 'Agendas auto deleted successfully.' });
    },
    deleteDiscussions: function (req, res) {
        console.log('Discussions deleted');
        res.json({ success: true, msg: 'Discussions auto deleted successfully.' });
    },
    deleteAssignments: function (req, res) {
        console.log('Assignments deleted');
        res.json({ success: true, msg: 'Assignments auto deleted successfully.' });
    }
}

module.exports = cronHandler;