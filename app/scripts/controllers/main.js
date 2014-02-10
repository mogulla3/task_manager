'use strict';

// 1つ目のコントローラ
// angular.module('taskManagerApp')
taskManager.controller('MainCtrl', function ($scope) {
    
    $scope.task_list = [];
    $scope.done_task_list = [];
    $scope.priority = "-";

    // ローカルストレージからの取得
    if (localStorage.task_list) {
      $scope.task_list = JSON.parse(localStorage.task_list);
    }

    if (localStorage.done_task_list) {
      $scope.done_task_list = JSON.parse(localStorage.done_task_list);
    }

    console.log($scope.task_list);

    // 現在時刻の取得
    $scope.now = function() {
      var date = new Date();
      return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    };

    // タスクをローカルストレージに保存する
    $scope.saveTask = function() {
      localStorage.task_list = JSON.stringify($scope.task_list);
      localStorage.done_task_list = JSON.stringify($scope.done_task_list);
    };

    // タスクを追加する
    $scope.addTask = function() {

      if (event.keyCode === 13 && $scope.content) {

        // div#task-listに追加していく
        // -> 実質配列に追加していくだけ。あとはAngularJSがバインディングしてくれる。
        // -> DOM操作が不必要ということ
        $scope.task_list.push({
            'id': $scope.genUniqID(),
            'content': $scope.content,
            'completed': false,
            'createdAt': $scope.now(),
            'priority': $scope.priority
        });

        // localStorage.task_list = JSON.stringify($scope.task_list);
        // ローカルストレージに保存
        $scope.saveTask();

        // input要素を空にする
        $scope.content = '';
      }
    };

    // タスクのIDを生成する
    $scope.genUniqID = function() {
      var date = new Date();
      var time = date.getTime();
      var random_num = Math.floor(Math.random() * 10000);
      return random_num.toString() + "-" + time.toString();
    };

    // タスクの編集を終わらせる
    $scope.finishEditMode = function(task) {
      if (event.keyCode === 13 && task.content) {
        task.updatedAt = $scope.now();
        $scope.toggleEditMode();

        // ローカルストレージに保存
        $scope.saveTask();
      }
    };

    // タスクの状態を切り替える
    $scope.toggleTaskStatus = function() {

      Array.prototype.push.apply($scope.task_list, $scope.done_task_list);
      var tmp_task_list = $scope.task_list;
      $scope.task_list = [];
      $scope.done_task_list = [];

      angular.forEach(tmp_task_list, function(task) {
          if (task.completed) {
            // 完了済みタスク
            task.doneAt = $scope.now();
            $scope.done_task_list.push(task);
          } else {
            // 未完了タスク
            $scope.task_list.push(task);
          }
      });

      // ローカルストレージに保存
      $scope.saveTask();
    };


    // タスクの削除
    $scope.deleteTask = function(id) {
      $scope.task_list.some(function(task, index){
          if (task.id === id) {
            $scope.task_list.splice(index, 1);
          }
      });
      $scope.done_task_list.some(function(task, index){
          if (task.id === id) {
            $scope.done_task_list.splice(index, 1);
          }
      });

      // ローカルストレージに保存
      $scope.saveTask();
    };


    // タスク編集モードの切り替え
    $scope.toggleEditMode = function() {
      $(event.target).closest('li').toggleClass('editing');
    }


    // // タスクのドラッグ&ドロップ
    // $scope.dragElement = null;
    // $scope.items = document.getElementById('task_list').getElementsByClassName('task');

    // // ドラッグ開始時
    // // -> ドラッグする要素の情報をdataTransferに格納する
    // $scope.handleDragStart = function (event) {
    // // Drop対象のイベントハンドラ内でHTMLの入れ替え元を参照する必要があるため、Drag対象要素を変数に保存する
    // $scope.dragElement = event.target;

    // // dataTransferオブジェクトにキーを指定してデータを保存すれば、
    // // Drop対象のイベントハンドラにて同じキーを用いて参照することができる
    // event.dataTransfer.setData('dragItem', $scope.dragElement.innerHTML);
    // console.log('hogehoge');
    // }


    // // ドラッグ中
    // function handleDrag(event) {
    // this.classList.add('dragging');
    // }


    // // ドラッグ操作が要素上を通過した時
    // function handleDragOver(event) {
    // // preventDefault()はそのイベントのデフォルト動作をキャンセルするメソッド。
    // // dropoverイベントのデフォルトの処理をキャンセルしないとdropイベントが送出されないため、必須
    // event.preventDefault();

    // // 背景色の変更
    // event.target.classList.add('dragover');

    // // dropEffectとは、Drop時に発生する動作を設定することができるプロパティ
    // // 今回は移動させたいのでmove
    // event.dataTransfer.dropEffect = 'move';
    // }

    // // ドラッグ要素が要素上から退出した時
    // function handleDragLeave(event) {
    // event.target.classList.remove('dragover');
    // }

    // // ドラッグ終了
    // function handleDragEnd(event) {
    // this.classList.remove('dragging');
    // }


    // // ドロップ時
    // function handleDrop(event) {
    // var dropElement = event.target;

    // event.target.classList.remove('dragover');

    // // dropイベントはバブリングするため、最終的にはブラウザに到達する。
    // // ブラウザによってはdropイベントで予期せぬ動作をする可能性があるため、イベントの伝播を停止するstopPropagation()を実行
    // event.stopPropagation();

    // // drop先要素のHTMLをdrag元要素のinnerHTMLへ設定
    // $scope.dragElement.innerHTML = dropElement.innerHTML;

    // // drop先要素のinnerHTMLにdrag元のHTMLを挿入
    // dropElement.innerHTML = event.dataTransfer.getData('dragItem');
    // }

    // // イベントの適用
    // Array.prototype.forEach.call($scope.items, function(item) {
    // item.addEventListener('dragstart', $scope.handleDragStart);
    // item.addEventListener('drag', handleDrag);
    // item.addEventListener('dragover', handleDragOver);
    // item.addEventListener('dragleave', handleDragLeave);
    // item.addEventListener('dragend', handleDragEnd);
    // item.addEventListener('drop', handleDrop);
    // });

});


// 2つ目のコントローラ
// angular.module('taskManagerApp')
// .controller('SubCtrl', function ($scope) {

// $scope.hello = 'sub hello';

// });
