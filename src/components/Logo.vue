<template>
      <div class="outer-dot1">
        <div class="outer-dot2">
          <div class="outer-dot3">
            <div class="inner-dot1"></div>
            <div class="inner-dot2"></div>
          </div>
        </div>
      </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
  .outer-dot1,
  .outer-dot2,
  .outer-dot3,
  .inner-dot1,
  .inner-dot2 {
    border-radius: 100%;
  }
  .outer-dot1 {
    width: 90%;
    height: 90%;
    background-color: #1890ff;
    position: relative;
    margin:auto;
    .outer-dot2 {
      width: 80%;
      height: 80%;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -40%;
      margin-top: -40%;
      .outer-dot3 {
        width: 66%;
        height: 66%;
        background-color: #1890ff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -33%;
        margin-top: -33%;
        animation: sk-rotate 2s infinite linear;
        -webkit-animation: sk-rotate 2s infinite linear;
        .inner-dot1 {
          width: 40%;
          height: 40%;
          background-color: #fff;
          position: absolute;
          top: 12%;
          left: 44%;
          animation: sk-bounce 2s infinite linear;
          -webkit-animation: sk-bounce 2s infinite linear;
        }
        .inner-dot2 {
          width: 20%;
          height: 20%;
          background-color: #fff;
          position: absolute;
          top: 60%;
          left: 20%;
          animation: sk-bounce 2s infinite linear;
          -webkit-animation: sk-bounce 2s infinite linear;
          animation-delay: -1s;
          -webkit-animation-delay: -1s;
        }
      }
    }

  @keyframes sk-rotate {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes sk-rotate {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes sk-bounce {
    0%,
    100% {
      -webkit-transform: scale(0);
    }

    50% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bounce {
    0%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }

    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
}
</style>