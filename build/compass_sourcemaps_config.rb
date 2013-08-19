# this configuration for generating sass source maps
# we can only generate them the following pre libraries now.
# gem install compass-sourcemaps --pre
# gem install sass --pre
# and then
# compass compile --config compass_sourcemaps_config.rb

http_path = "/"
css_dir = "app/css"
sass_dir = "app/"
images_dir = "../"
javascripts_dir = "app/js"
output_style = :expanded
sass_options = { :sourcemap => true }
