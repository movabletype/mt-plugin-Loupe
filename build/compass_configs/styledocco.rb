# compass watch --config compass_configs/styledocco.rb

http_path = "/"
css_dir = "app/css"
sass_dir = "app/"
images_dir = "../"
javascripts_dir = "app/js"
output_style = :expanded
line_comments = false;

on_stylesheet_saved do |filename|
  `rm ../styleguide/index.html`
  `grunt styledocco-callback`
end
