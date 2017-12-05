(function($){

    $(document).ready(function(){

        $('body').scrollspy().on('activate.bs.scrollspy', function () {

        });

        if ($(document).scrollTop() > 250) {
            $('.bs-docs-sidebar').css({
                "position": "fixed",
                "top": "40px"
            });
        }

        $(document).scroll(function () {
            if ($(document).scrollTop() > 250) {
                $('.bs-docs-sidebar').css({
                    "position": "fixed",
                    "top": "40px"
                });
            } else {
                $('.bs-docs-sidebar').css({
                    "position": "",
                    "top": "0px"
                });
            }
        });

        $('pre code').each(function(i, block) {
            var plain = $(this).text();
            $(this).parent().parent().prev().find(".btn-clipboard").click(function(){
                if(window.clipboardData){
                    window.clipboardData.clearData();
                    window.clipboardData.setData("text", plain);
                } else {
                    var clip = new ZeroClipboard($(this));
                    clip.setText(plain);
                }
            });

            hljs.highlightBlock(block);

        });
    });

})(jQuery);
