package App::Nellou;
use Dancer ':syntax';

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

# get '/assets/:file.png' => sub {
#   my $file = param 'file';
#
#   return send_file ( "/assets/$file.png", content_type => 'image/png', "$file.png" );
# };

true;
