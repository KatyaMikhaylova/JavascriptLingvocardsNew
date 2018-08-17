$(document).ready(function () {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/cards/' + id,
            success: function (response) {
                alert(`Коллекция удалена`);
                window.location.href = '/own';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
    $('.delete-card').on('click', function (x) {
        $target = $(x.target);
        const id = $target.attr('card-id');
        $.ajax({
            type: 'DELETE',
            url: '/cards/remove/' + id,
            success: function (response) {
                alert(`Карточка удалена`);
                window.location.href = '/own';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
    $('.get-data').on('mousedown', function (x) {
        $target = $(x.target);
        const id = $target.attr('coll-id');

        fetch(`/lingvo/getdata/${id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(Lingvo);
    });

    function Lingvo(data) {
        $('.description').hide();
        $('.operate').show();
        let arr1 = data.cards;
        studied.push(arr1[0]);
console.log(arr1);
        $('#next_button').on('click', function (e) {

                if (forgotten.length !== 0) {
                    arr1 = $.merge(arr1, forgotten);

                    forgotten = [];

                }
                iter++;
                console.log(iter);
                let new_card = nextItem(arr1);
                if (new_card) {

                    if (iter % 3 !== 0 || iter === 0) {
                        document.getElementById('fface').textContent = new_card.front;
                        document.getElementById('bface').textContent = new_card.back;
                        document.getElementById('bfaceT').textContent = new_card.translation;
                        document.getElementById('bfaceE').textContent = new_card.example;
                        studied.push(new_card);
                    }
                    else {
                        AskOne(studied);
                        document.getElementById('fface').textContent = new_card.front;
                        document.getElementById('bface').textContent = new_card.back;
                        document.getElementById('bfaceT').textContent = new_card.translation;
                        document.getElementById('bfaceE').textContent = new_card.example;
                        studied.push(new_card);

                    }
                }
                else if (studied.length > 1 && learned.length!==0) {
                    studied.push(learned[0]);
                    AskOne(studied);
                }
                else if (learned.length==0 && studied.length == 3) {
                    AskOne(studied);
                }
                else {
                    alert('Вы закончили изучение этого набора карточек');
                    window.location.href = '/'
                }

        });

    }

    let studied = [];
    let learned = [];
    let forgotten = [];
    let i = 0;
    let iter = 0;

    function nextItem(arr) {
        i = i + 1; // increase i by one
        if (i < arr.length) {
            return arr[i]; // give us back the item of where we are now
        } else {
            return false;
        }

    }

    function nextCounter(arr) {
        counter = counter + 1; // increase i by one
       // counter = counter % arr.length; // if we've gone too high, start from `0` again
       //  if (counter<=arr.length){
       //      return counter;
       //  } else {
       //      return 0
       //  }
        return counter;
    }

    function simpleItem(arr) {
        i = i + 1;
        i = i % arr.length;
        return arr[i];
    }

    function AskOne(x) {
        $('.operate').hide();
        $('.question').show();
        showQuest(x, 1);
        $('#next_question').on('click', function () {
            $('.popup').removeClass('alert-success_msg alert-error');
            $('.popup').hide();
            $('.demo').off();
            showQuest(x, 1);
        });


    }

    function showQuest(y, j) {
        if (y.length > 2) {
            let a = Math.abs(j - 1);

            document.getElementById('first').textContent = y[a].back;
            $('#first').attr('data-answ', y[a]._id);
            let b = Math.abs(j - 2);

            document.getElementById('second').textContent = y[b].back;
            $('#second').attr('data-answ', y[b]._id);
            let c = (j === 2 ? 2 : Math.abs(j - 3));

            document.getElementById('third').textContent = y[c].back;
            $('#third').attr('data-answ', y[c]._id);
            document.getElementById('task-space').textContent = y[j - 1].front;
            $('#task-space').attr('data-task', y[j - 1]._id);
            checkAnswer(y[j - 1]);
        }
        else if (y.length == 1) {
            $('.question').hide();
            $('.operate').show();
        }
        else {


            document.getElementById('second').textContent = y[1].back;

            $('#second').attr('data-answ', y[1]._id);


            document.getElementById('third').textContent = y[0].back;
            $('#third').attr('data-answ', y[0]._id);
            document.getElementById('task-space').textContent = y[0].front;
            $('#task-space').attr('data-task', y[0]._id);
            checkAnswer(y[0]);
        }
    }

    function checkAnswer(quest) {


        $('.demo').on('click', function (e) {
            $target = $(e.target);
            const ans_id = $target.attr('data-answ');
            const check = $('#task-space').attr('data-task');
            // console.log(ans_id);
            // console.log(check)
            if (ans_id === check) {
                $('.popup').addClass('alert-success_msg');
                $('.popup').show();
                $('.mess').text('Ответ верный');
                studied.splice(studied.indexOf(quest), 1);
                learned.push(quest);
                console.log(learned);
                console.log(studied);


            } else {
                $('.popup').addClass('alert-error');
                $('.popup').show();
                $('.mess').text('Ответ неверный');
                studied.splice(studied.indexOf(quest), 1);
                forgotten.push(quest);
                console.log(studied);
            }
        });

    }


    $('#js-flip').bind('click ', function () {
        $('#js-flip .card').toggleClass('flipped');
    });
    $('#translate').on('click', function (x) {
        $('.back').toggleClass('hid');
    });

});
