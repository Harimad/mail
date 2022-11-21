const $inputBox = document.querySelector('#inputBox')
const $userKeyword = document.querySelector('#userKeyword')
const $userEmail = document.querySelector('#userEmail')
const $keywordBtn = document.querySelector('#keywordBtn')
const $clearBtn = document.querySelector('#clearBtn')
const $arrowUp = document.querySelector('#arrowUp')

const inputClear = () => {
  $userKeyword.value = ''
  $userEmail.value = ''
  $userKeyword.focus()
}

const swal = (title, msg) => {
  return Swal.fire({
    icon: 'error',
    title: '입력창...',
    text: `${title} 을/를 다시 입력해 주세요!`,
    footer: msg,
  })
}

$inputBox.addEventListener('submit', e => {
  e.preventDefault()

  Swal.fire({
    title: '메일링 서비스를 받으시겠습니까?',
    text: '해당 정보로 이메일을 발송합니다!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!',
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire(
        '성공!',
        '이메일이 발송 되었습니다. 취업 성공을 기원합니다!',
        'success'
      )
      if (
        !$userKeyword.value.trim() ||
        keywords.indexOf($userKeyword.value) === -1
      ) {
        // 경고창
        swal(
          '키워드',
          '<b>React, Vue, Nodejs</b> 와 같은 키워드를 입력해주세요😉'
        )
        return
      }

      let regExp = /^([a-z]+\d*)+(\.?[a-z]+\d*)+@([a-z]+\d*)+(\.[a-z]{2,3})+$/
      console.group(regExp.test($userEmail.value), $userEmail.value)
      if (!regExp.test($userEmail.value)) {
        // 경고창
        swal(
          '이메일',
          `문자로 시작해서 숫자를 조합하고 @를 붙입니다. <br>.com, .kr 같은 접미사를 붙입니다.`
        )
        return
      }

      const formData = new FormData($inputBox)
      const userInput = new URLSearchParams(formData)

      fetch(`http://localhost:3000/post`, {
        method: 'POST',
        body: userInput,
      })
        .then(res => res.json())
        .then(data => console.log(JSON.stringify(data)))
        .catch(err => console.log(err))
    } else {
      Swal.fire('취소 되었습니다.', '다시 시도해 보세요.', 'info')
    }
  })
})

$clearBtn.addEventListener('click', () => {
  inputClear()
})

const goToTop = () => {
  window.addEventListener('scroll', () => {
    if (document.querySelector('html').scrollTop > 100) {
      $arrowUp.style.display = 'block'
    } else {
      $arrowUp.style.display = 'none'
    }
  })

  $arrowUp.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })
}

goToTop()
