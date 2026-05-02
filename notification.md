Notification System Design

## Stage1

purpose:APIs to manage notifications

get_all_notifications:GET /notifications

response:[
    {
        "id":"1",
        "type":"Placement",
        "message":"Company hiring",
        "timestamp":"2026-04-22T17:51:18"
    }
]

get_unread_notifications:GET /notifications/unread

mark_as_read:PUT /notifications/:id/read

create_notification:POST /notifications

request:
{
    "type":"Result",
    "message":"Mid sem result"
}

headers:
Authorization:Bearer token
Content-Type:application/json


## Stage2

database:MongoDB

schema:{
    "_id":"ObjectId",
    "studentId":"string",
    "type":"Placement or Result or Event",
    "message":"string",
    "isRead":false,
    "createdAt":"date"
}

problem1:too_many_records
problem2:slow_queries

solution1:index_on_studentId
solution2:index_on_isRead
solution3:use_pagination


## Stage3

given_query:
SELECT * FROM notifications
WHERE studentID=1042 AND isRead=false
ORDER BY createdAt DESC;

reason:full_table_scan

fix:
CREATE INDEX idx1 
ON notifications(studentID,isRead,createdAt DESC);

problem:indexing_all_columns_increases_space

placement_query:
SELECT studentID
FROM notifications
WHERE notificationType='Placement'
AND createdAt>=NOW()-INTERVAL 7 DAY;


## Stage4

problem:too_many_requests_on_db

solution1:caching_using_redis
solution2:pagination_limit_10
solution3:lazy_loading
solution4:websockets


## Stage5

problem1:sequential_processing
problem2:failure_stops_execution

notify_function:
function notifyAll(list,msg){
    for(let i=0;i<list.length;i++){
        queue.push({id:list[i],msg:msg});
    }
}

worker_function:
function processQueue(job){
    sendEmail(job.id,job.msg);
    saveToDb(job.id,job.msg);
    pushToApp(job.id,job.msg);
}

failure_solution:retry_and_store_failed_jobs

processing:async_execution


## Stage6

goal:get_top_n_notifications

priority:
Placement:3
Result:2
Event:1

function:
function getTop(list,n){
    list.sort(function(a,b){
        if(priority[b.Type]!=priority[a.Type]){
            return priority[b.Type]-priority[a.Type];
        }
        else{
            return new Date(b.Timestamp)-new Date(a.Timestamp);
        }
    });
    return list.slice(0,n);
}

continuous_data:use_heap_keep_top_n