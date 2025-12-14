import service from '@/utils/request'

export function getExamListService(params) {
  return service({
    url: "/exam/list",
    method: "get",
    params,
  });
}

export function delExamService(examId) {
  return service({
    url: "/exam/delete",
    method: "delete",
    params: { examId },
  });
}

export function publishExamService(examId) {
  return service({
    url: "/exam/publish",
    method: "put",
    params: { examId },
  });
}

export function cancelPublishExamService(examId) {
  return service({
    url: "/exam/cancelPublish",
    method: "put",
    params: { examId },
  });
}