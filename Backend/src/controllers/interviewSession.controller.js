import interviewReportModel from "../models/InterviewRepot.model";
import interviewSession from "../models/InterviewSession";

async function interviewSessionController(req, res) {
  const { interviewReportId } = req.body;

  if (!interviewReportId) {
    return res.status(400).json({
      msg: "Interview report id is required",
    });
  }

  const interviewReport =  await interviewReportModel.findOne({
    _id = interviewReportId,
    user = req.user.id,
  })

  if(!interviewReport){
    return res.status(400).json({
        msg: 'Interview report id not found'
    })
  }
}

module.exports = interviewSession;
